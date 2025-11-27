<<<<<<< Updated upstream
<<<<<<< HEAD
const connectMongo = require("./db/mongo");
const fs =require('fs');
const path = require('path');
=======
>>>>>>> 9de406a (updated main.js)
=======
require('dotenv').config();
const mongoose = require('mongoose');
const Record = require('./db/recordModel');
const fs = require('fs');
const path = require('path');
require('./events/logger');
>>>>>>> Stashed changes
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
mongoose.connect(process.env.MONGO_URI,{
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
	console.error('MongoDB connection error: ',err);
	process.exit(1);
});

async function listRecords(){
	return await Record.find().sort({ id: 1});
}
async function addRecord(name, value){
	const last = await Record.findOne().sort({ id: -1});
	const id = last ? last.id + 1 : 1;
	await Record.create({ id, name, value, created: new Date() });
}
async function updateRecord(id, name, value){
	const res =await Record.updateOne({id},{name,value});
	return res.modifiedCount > 0;
}
async function deleteRecord(id){
	const res = await Record.deleteOne({id});
	return res.deletedCount > 0;
}



function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records 
7. Export Data
8. Restore Backup
9. View Vault Statistics
10. Exit
=====================
  `);

  rl.question('Choose option: ', ans => {
    switch (ans.trim()) {
      case '1':
        rl.question('Enter name: ', name => {
          rl.question('Enter value: ', async value => {
            await addRecord({ name, value });
            console.log('✅ Record added successfully!');
            menu();
          });
        });
        break;

      case '2':
        const records = await listRecords();
        if (records.length === 0) console.log('No records found.');
        else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`));
        menu();
        break;

      case '3':
        rl.question('Enter record ID to update: ', id => {
          rl.question('New name: ', name => {
            rl.question('New value: ', async value => {
              const updated = await updateRecord(Number(id), name, value);
              console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
              menu();
            });
          });
        });
        break;

      case '4':
        rl.question('Enter record ID to delete: ', async id => {
          const deleted = await deleteRecord(Number(id));
          console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
          menu();
        });
        break;

<<<<<<< Updated upstream
      case '5':
	
	rl.question('Enter search keyword: ', keyword => {
		const results = db.listRecords().filter(record =>
			record.id.toString() === keyword.trim() ||
		record.name.toLowerCase().includes(keyword.trim().toLowerCase())
	);
	if(results.length === 0){
		console.log('No records found.');
	}else{
		console.log(`Found ${results.length} matching records`);
		results.forEach((r,i)=>{
			console.log(`${i+1}. ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`);
		});
	}
	menu();
});
	break;
=======

case '5': // Search Records
  rl.question('Enter search keyword: ', async keyword => {
    const results = await Record.find({
	$or: [
		{ id: Number(keyword) || 0},
		{ name: {$regex: keyword, $options: 'i'}}
	]
	});
    

    if (results.length === 0) {
      console.log('No records found.');
    } else {
      console.log(`Found ${results.length} matching records:`);
      results.forEach((r, i) => {
        console.log(`${i + 1}. ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`);
      });
    }

    menu(); // show menu again
  });
  break;
>>>>>>> Stashed changes

      case '6':
	rl.question('Choose field to sort by (name/created): ', field =>{
		field = field.trim().toLowerCase();
		if(field !== 'name' && field !== 'created'){
			console.log('Invalid field. Use "name" or "created".');
			return menu();
		}
		rl.question('Choose order (ascending/descending); ', async order=>{
			order=order.trim().toLowerCase();
			if(order !== 'ascending' && order !== 'descending'){
				console.log('Invalid order. Use "ascending" or "descending".');
				return menu();
			}
			const sortObj = {};
			sortObj[field] = order === 'ascending' ? 1 : -1;
			const sorted = await Record.find().sort(sortObj);

			if (sorted.length ===0){
				console.log('No records to sort.');
			else{
			console.log('Sorted Records:');
			sorted.forEach((r,i) => {
			console.log(`${i+1}. ID: ${r.id} | Name: ${r.name} | Created: ${r.created}`);

	});
	}
	menu();
	});
	});
	break;

      case '7':


	const allRecords=await listRecords();

	const exportPath = path.join(__dirname, 'export.txt');

	const header =
	`====== NodeVault Export ===================\n` +
	`Export Time: ${new Date().toLocaleString()}\n` +
	`Total Records: ${allRecords.length}\n` +
	`File: export.txt\n` +
	`==========================================\n\n`;

	let content= ' ';
	allRecords.forEach((r,i) =>{
		content += `${i+1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.created}\n`;
	});

	fs.writeFileSync(exportPath, header + content);

	console.log('Data exported successfully to export.txt!\n');
	menu();
	break;
      
	case '8':
	const backupsDir = path.join(__dirname, 'backups');
	const files = fs.readdirSync(backupsDir).filter(f => f.endsWith('.json'));

	if(files.length === 0){
		console.log("No backup files found.");
		return menu();
	}

	console.log("\nAvailabe Backups:");
	files.forEach((file, index)=> {
		console.log(`${index + 1}. ${file}`);
	});

	rl.question("\nEnter backup number to restore: ", async num=>{
		const index=Number(num) - 1;

		if(index<0 || index>= files.length){
			console.log("Invalid selection.");
			return menu();
		}

		const selectedFile = files[index];
		const data =JSON.parse(fs.readFileSync(path.join(backupsDir,selectedFile), 'utf8');

		await Record.deleteMany({});

		for(const record of data){
			await Record.create(record);
		}

		console.log(`\n Backup restored successfully from ${selectedFile}`);
		menu();

	});
	break;

	case '9':
		const statsData = await listRecords();

	console.log("\nVault Statistics:");
	console.log("---------------------------");
	console.log(`Total Records: ${statsData.length}`);


	if(statsData.length === 0){
		console.log("\n(Other statistics unavailable because vault is empty)");
		return menu();
	}

	let longestRecord = statsData.reduce((max, r)=>
		r.name.length > max.name.length ? r : max
	);

	console.log(`Longest Name: ${longestRecord.name} (${longestRecord.name.length} characters)`
	);
	
	const sortedByDate = [...statsData].sort((a,b)=>
		new Date(a.created) - new Date(b.created)
	);


	console.log(`Earliest Record: ${sortedByDate[0].created}`);
	console.log(`Latest Record: ${sortedByDate[sortedByDate.length - 1].created}`);
	menu();
	break;


	case '10':
        console.log('👋 Exiting NodeVault...');
        rl.close();
	mongoose.disconnect();
        break;


      default:
        console.log('Invalid option.');
        menu();
    }
  });
}

menu();

