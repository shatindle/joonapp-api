import fetch from 'node-fetch';
import { Me } from './me.js';

export default class JoonApi {
    children = [];

    /**
     * Interact with the Joon API
     * @param {string} email Login email address
     * @param {string} password Login password
     */
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    /**
     * Login to joonapp.io
     */
    async login () {
        const response = await fetch("https://app.joonapp.io/api/auth/signin/", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "application/json",
              "priority": "u=1, i",
              "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              "timezone": "America/Chicago",
              "Referer": "https://my.joonapp.io/",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({ email: this.email, password: this.password }),
            "method": "POST"
        });
        const data = await response.json();
    
        this.id_token = data.id_token;
        this.refresh_token = data.refresh_token;
    }

    /**
     * Get details about your user
     * @returns {Me}
     */
    async me (retry = true) {
        if (retry && !this.id_token) await this.login();

        const response = await fetch("https://app.joonapp.io/api/users/me/?update_last_login=true", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9",
              "authorization": this.refresh_token,
              "priority": "u=1, i",
              "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              "timezone": "America/Chicago",
              "token": this.id_token
            },
            "referrerPolicy": "same-origin",
            "body": null,
            "method": "GET"
        });

        if (response.ok) {
            const data = await response.json();

            return new Me(
                data.id,
                data.name,
                data.last_name,
                data.email,
                data.date_joined,
                data.avatar,
                data.phone_number,
                data.legacy_parent_id,
                data.last_login_date,
                data.enable_developer_mode,
                data.passcode,
                data.sub_offering,
                data.num_quests_verified,
                data.max_free_verified,
                data.fb_purchase_info,
                data.show_academy_tab
            );
        } else {
            if (!retry) throw "Unable to get families";

            await this.login();
            return await this.me(false);
        }
        
    }

    async family (retry = true) {
        if (retry && !this.id_token) await this.login();

        const response = await fetch("https://app.joonapp.io/api/families/", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": this.refresh_token,
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "timezone": "America/Chicago",
                "token": this.id_token,
                "Referer": "https://my.joonapp.io/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        });

        if (response.ok) {
            return await response.json();
        } else {
            if (!retry) throw "Unable to get families";

            await this.login();
            return await this.family(false);
        }
    }

    /**
     * 
     * @param {boolean} retry Whether or not to allow the API to retry with a fresh login
     * @returns {Reward[]} The list of rewards
     */
    async rewards (retry = true) {
        if (retry && !this.id_token) await this.login();

        const response = await fetch("https://app.joonapp.io/api/purchased-custom-rewards/", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": this.refresh_token,
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "timezone": "America/Chicago",
                "token": this.id_token
            },
            "referrerPolicy": "same-origin",
            "body": null,
            "method": "GET"
        });

        if (response.ok) {
            const data = await response.json();

            return data.results.map(t => new Reward(t.id, t.user_id, t.reward.id, t.reward.title, t.reward.emoji, t.reward.cost, t.reward.template_id, t.reward.user_ids, t.purchase_date, t.redeem_date));
        } else {
            if (!retry) throw "Unable to get families";

            await this.login();
            return await this.rewards(false);
        }
    }

    async redeem(reward_id = "", retry = true) {
        const response = await fetch(`https://app.joonapp.io/api/purchased-custom-rewards/${reward_id}/redeem/`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": this.refresh_token,
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "timezone": "America/Chicago",
                "token": this.id_token,
                "Referer": "https://my.joonapp.io/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "POST"
        });

        if (response.ok) {
            return await response.json();
        } else {
            if (!retry) throw "Unable to redeem reward";

            await this.login();
            return await this.redeem(reward_id, false);
        }
    }
}

export class Reward {
    id = 0;
    user_id = 0;
    reward_id = 0;
    title = "";
    emoji = "";
    cost = 0;
    template_id = null;
    user_ids = [];
    purchase_date = new Date();
    redeem_date = new Date();

    constructor(id, user_id, reward_id, title, emoji, cost, template_id, user_ids, purchase_date, redeem_date) {
        this.id = id;
        this.user_id = user_id;
        this.reward_id = reward_id;
        this.title = title;
        this.emoji = emoji;
        this.cost = cost;
        this.template_id = template_id;
        this.user_ids = user_ids;
        this.purchase_date = new Date(purchase_date);
        this.redeem_date = redeem_date ? new Date(redeem_date) : null;
    }
}