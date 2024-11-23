export class Me {
    id = "";
    name = "";
    last_name = "";
    email = "";
    date_joined = new Date();
    avatar = "";
    phone_number = "";
    legacy_parent_id = null;
    last_login_date = new Date();
    enable_developer_mode = false;
    passcode = null;
    sub_offering = null;
    num_quests_verified = 0;
    max_free_verified = 7;
    fb_purchase_info = null;
    show_academy_tab = false;

    constructor(id, name, last_name, email, date_joined, avatar, phone_number, legacy_parent_id, last_login_date, enable_developer_mode, passcode, sub_offering, num_quests_verified, max_free_verified, fb_purchase_info, show_academy_tab) {
        this.id = id;
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.date_joined = new Date(date_joined);
        this.avatar = avatar;
        this.phone_number = phone_number;
        this.legacy_parent_id = legacy_parent_id;
        this.last_login_date = new Date(last_login_date);
        this.enable_developer_mode = enable_developer_mode;
        this.passcode = passcode;
        this.sub_offering = sub_offering;
        this.num_quests_verified = num_quests_verified;
        this.max_free_verified = max_free_verified;
        this.fb_purchase_info = fb_purchase_info;
        this.show_academy_tab = show_academy_tab;
    }
}
