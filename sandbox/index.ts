import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('car', {
        name: 'Toyota',
        color: 'yellow',
        mileage: 250000
    })

    const car = await client.hGetAll('car')

    if (Object.keys(car).length == 0) {
        console.log('Car not found, respond with 404')
        return
    }

    console.log(car)
};

run();
