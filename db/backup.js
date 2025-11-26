const fs = require("fs");
const path = require("path");

const backupDir = path.join(__dirname, "..", "backups");

if(!fs.existsSync(backupDir)){
	fs.mkdirSync(backupDir);
}
function createBackup(data){
	const now = new Date();

	const fileName = `backup_${now.getFullYear()}-${(now.getMonth()+1)
		.toString().padStart(2, "0")}-${now.getDate()
		.toString().padStart(2, "0")}_${now.getHours()
		.toString().padStart(2,"0")}-${now.getSeconds()
		.toString().padStart(2,"0")}-${now.getSeconds()
		.toString().padStart(2,"0")}.json`;

	const filePath = path.join(backupDir, fileName);

	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

	console.log(`Backup created: ${fileName}`);
}
module.exports = createBackup;
