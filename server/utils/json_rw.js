import fs from "fs";

export const save_json = (json, dir, filename) => {
    const file_path = dir + "/" + filename
    if (fs.existsSync(file_path)) {
        const old_json = fs.readFileSync(file_path, 'utf8')
        json = Object.assign(JSON.parse(old_json), json);
    }
    fs.writeFileSync(file_path, JSON.stringify(json));
}
export const read_json = (dir, filename) => {
    const file_path = dir + "/" + filename
    if (!fs.existsSync(file_path)) {
        return {};
    } else {
        return JSON.parse(fs.readFileSync(file_path, 'utf8'));
    }
}