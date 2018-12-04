// Ask for desired project name.
const fs = require('fs-extra')
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
const path = require('path')
const child_process = require('child_process')


let targetName = ''


rl.setPrompt('What should the project\'s name be? ');
rl.prompt();
rl.on('line', function(line) {
    line = line.trim()
    let copyFrom = path.dirname(path.join(__dirname, '../../'))
    let copyTo   = path.join(path.dirname(path.join(__dirname, '../../../')), line)
    targetName = line

    if (isValidFileName(targetName) && isValidPath(copyTo)) {
        if(clone(copyFrom, copyTo)) {
            console.log(`Cloned Project ${targetName} successfully to: `)
            console.log(`${copyTo}`)
        }
        rl.close();
        return;
    }

    console.log('That project name is invalid or a folder with that name already exists.')
    rl.prompt();

}).on('close',function(){
    process.exit(0);
});



// Check if the name is valid by making sure a folder does not exist already with that name.
const isValidPath = (toPath) => {
    if(fs.existsSync(toPath)) {
        return false;
    } else {
        return true;
    }
}


const isValidFileName = (name) => {
    let forbiddenChars = ['/', '\\', '<', '>', ':', '"', '|', '?', '*',]

    if(!name || !name.length || name.length < 1) {
        return false;
    } 

    for(let c in forbiddenChars) {
        if(name.indexOf(forbiddenChars[c]) != -1) {
            return false;
        }
    }

    if(name[name.length - 1] == '.') {
        return false;
    }

    return true;
}


// Clone project 
const clone = (from, to) => {
    console.log('Please hold on, copying files...')

    const filterFunction = (from, to) => {
        if(from.split('\\').pop() == 'node_modules') {
            return false;
        } else if(from.split('\\').pop() == '.git') {
            return false;
        } else {
            return true;
        }
    }

    // Copy most of the files over.
    fs.copySync(from, to, {
        overwrite: false,
        errorOnExist: true,
        filter: filterFunction
    })

    // Modify package.json
    let packageJSON = fs.readFileSync(path.join(to, 'package.json'))
    packageJSON = JSON.parse(packageJSON)
    packageJSON.name = targetName
    packageJSON = JSON.stringify(packageJSON)
    fs.writeFileSync(path.join(to, 'package.json'), packageJSON)

    // Rename readme
    fs.renameSync(path.join(to, 'README.md'), path.join(to, 'PROJECT-STRUCTURE.md'))

    // Create new readme
    fs.writeFileSync(path.join(to, 'README.md'), 
`# What is this?  
Details for ${targetName} project go here.
    
# How to develop/build  
Instructions are within the *PROJECT-STRUCTURE.md* file`)

    // Git init and commit.
    child_process.execSync(`cd "${to}" && git init && git add . && git commit -a -m "Initial Commit after cloning project."`)

    return true;
}