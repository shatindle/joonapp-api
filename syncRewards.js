import JoonApi from './api/main.js';
import 'dotenv/config';
import Database from './data/firebase.js';

process.env.TZ = 'America/Chicago';

const joon = new JoonApi(process.env.JOONEMAIL, process.env.JOONPASSWORD);
const database = new Database();

const familyList = await joon.family();
const rewards = await joon.rewards();

const family = familyList.results[0];
const kids = {};

for (let profile of family.profiles.filter(t => t.role === "child")) {
    kids[profile.user.id] = profile.user.name;
}

for (let reward of rewards) {
    if (reward.purchase_date > new Date(new Date().getTime() - 6 * 60 * 60 * 1000)) {
        await database.saveReward(reward.id, reward.user_id, kids[reward.user_id], reward.title, reward.purchase_date.toUTCString(), reward.redeem_date?.toUTCString(), reward.redeem_date !== undefined);
    }
}