import 'dotenv/config';
import express from  "express";
import { PrismaClient } from "../generated/prisma"
import { initialise_model_call,continue_model_call } from "./llm";
import { Messages, TurnHistory } from "./types/types";
import { search_mem0, store_mem0 } from "./mem";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'loaded' : 'missing');

const db = new PrismaClient();


db.$connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
});

app.post('/start',async (req,res) => {
    try {
        console.log('/start')
        const {title,description,name,currentScenario,location,genre,baseTraits,userId} = req.body;

        if(!description || !title || !name || !currentScenario || !location || !genre || !baseTraits || !userId){
            throw new Error('Some fields are missing');
        }

        const narrationText = await initialise_model_call({
            genre,
            protagonist_name: name,
            protagonist_trait: baseTraits,
            starting_location: location,
            starting_scenario: currentScenario
        });

        const protagonistData = {
            name,
            location,
            baseTraits: [baseTraits],
            health: 100,
            inventory: [],
            currentTraits: [baseTraits]
        };

        const story = await db.story.create({
            data: {
                title,
                description,
                startingScene:currentScenario,
                genre,
                isCompleted: false,
                content:narrationText,
                protagonist: {
                    create: protagonistData
                } 
            },
            include: { protagonist: true } 
        });
        const protagonist_curr = story.protagonist as any;

        await db.scene.create({
            data:{
                storyId: story.id,
                turnNumber: 1,
                narrationText,
                userAction: currentScenario,
                protagonistSnapshot : JSON.stringify(protagonist_curr)
            }
        })

        const initialMem0Message: Messages = [{ role: 'assistant', content: narrationText }];
        await store_mem0(initialMem0Message, userId);

        return res.status(200).send({
            data: narrationText,
            storyId: story.id,
            protagonistId: protagonist_curr.id
        });
    } catch (err) {
        console.log((err as Error).message);
        res.status(400).send({
            error: (err as Error).message
        })
    }
})

app.post('/continue',async (req,res)=>{
    try {
        const { storyId, userId, userAction, NARRATIVE_REWRITE_TOKEN } = req.body;
        if (!userAction || !storyId || !userId) throw new Error("Required fields are missing");

        const story_detail = await db.story.findFirstOrThrow({
            where:{id:storyId}
        })

        if(story_detail.isCompleted && !NARRATIVE_REWRITE_TOKEN){
            // change status code , should reflect that story has ended and can not be modified until token is assigned
            return res.status(200).send({
                error: "Can not proceed as story has ended already"
            });
        }

        const protagonist_initial = await db.protagonist.findFirstOrThrow({
            where: { storyId }
        }) as any;

        const recentScenes = await db.scene.findMany({
            where: { storyId },
            orderBy: { turnNumber: 'desc' },
            take: 5
        });

        const recency_buffer: TurnHistory[] = recentScenes.reverse().map(s => ({
            action: s.userAction,
            narration: s.narrationText,
        }));
        
        const memoryResult = await search_mem0(userAction, userId);
        const memoryItems = memoryResult.results || [];

        const factual_knowledge: string[] = memoryItems.map((m: any) => 
             `FACT: ${m.metadata?.fact || m.content}` 
        );

        const storyGenre = (await db.story.findUniqueOrThrow({ where: { id: storyId } })).genre;

        const llm_res_structured = await continue_model_call({
            user_feed: userAction,
            context: {
                genre: storyGenre,
                protagonist_detail: {
                    name: protagonist_initial.name,
                    location: protagonist_initial.location,
                    health: protagonist_initial.health,
                    inventory: protagonist_initial.inventory,
                    traits: protagonist_initial.baseTraits 
                },
                factual_knowledge: factual_knowledge,
                recency_buffer: recency_buffer,
            }
        });

        const { narration, changes } = llm_res_structured;
        
        let protagonist_final = { ...protagonist_initial };

        if (changes) {
            protagonist_final = {
                ...protagonist_initial,
                location: changes.location || protagonist_initial.location,
                health: changes.health ?? protagonist_initial.health,
                inventory: changes.inventory || protagonist_initial.inventory,
                currentTraits: changes.traits || protagonist_initial.currentTraits
            };
        }

        if(changes && changes.isStoryEnd){
            await db.story.update({
                where:{
                    id:storyId
                },
                data:{
                    isCompleted: changes.isStoryEnd
                }
            })
        }
        
        await db.protagonist.update({
            where: { id: protagonist_initial.id },
            data: {
                location: protagonist_final.location,
                health: protagonist_final.health,
                inventory: protagonist_final.inventory, 
                currentTraits: protagonist_final.currentTraits 
            }
        });

        const prevTurnNumber = await db.scene.count({ where: { storyId } });
        const newTurnNumber = prevTurnNumber + 1;
        
        await db.scene.create({
            data: {
                storyId: storyId,
                turnNumber: newTurnNumber,
                narrationText: narration,
                userAction: userAction,
                protagonistSnapshot: JSON.stringify(protagonist_initial) 
            }
        });
        
        const newMem0Messages: Messages = [
            { role: 'user', content: userAction },
            { role: 'assistant', content: narration }
        ];
        await store_mem0(newMem0Messages, userId);

        return res.status(200).send({
            data: narration,
            newState: protagonist_final
        });

    } catch (err) {
        res.status(400).send({
            error: (err as Error).message
        })
    }
})

const PORT = 8080;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})