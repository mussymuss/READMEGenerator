
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");


inquirer.prompt([
    {
        type:"input",
        message:"What is your Github username?",
        name:"github"
    },
    {
        type: "input",
        name: "email",
        message: "What is your email?"
    },
    {
        type:"input",
        message: "Please provide project title",
        name:"project"
    },
    {
        type: "input",
        name: "description",
        message: "Please write a short description of your project"
    },
    {
        type: "list",
        name: "license",
        message: "What kind of license should your project have?",
        choices: ["Eclipse", "APACHE", "BSD", "None"]
    },
    {
        type: "input",
        name: "dependencies",
        message: "What command should be run to install dependencies?",
        default: "npm i"
    },
    {
        type: "input",
        name: "test",
        message: "What command should be run to run tests?",
        default: "npm test"
    },
    {
        type: "input",
        message: "What does the user need to know about contributing to the repo?",
        name: "contributing"
    }
]).then(function(answer){
    // console.log(answer);

    if (answer.license === "BSD") {
        answer.license = "[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)";
    }
    if (answer.license === "Apache") {
        answer.license = "[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)";
    }
    if (answer.license === "Eclipse") {
        answer.license = "[![License](https://img.shields.io/badge/License-EPL%201.0-red.svg)](https://opensource.org/licenses/EPL-1.0)"
    }
    if (answer.license === "MIT") {
        answer.license = "[![License](https://img.shields.io/badge/License-MIT%201.0-blue.svg)](https://opensource.org/licenses/MIT)"
    }
    const queryURL = `https://api.github.com/users/${answer.username}`;

    axios.get(queryURL).then(function(res){
        let userImage = res.data.avatar_url;
        let userBlog = res.data.blog;
        const data = getData(answer, userImage,userBlog);

        fs.writeFile("README.md", data, function() {

        });
    }) 
});

function getData({username, github, email, project, description, license, dependencies, tests, about, contributing},userImage,userBlog) {

    return `
    
# ${project}
## Description
${description}
        
## Table of Contents
        
* [Installation](#installation)
        
* [Usage](#usage)
        
* [License](#license)
        
* [Contributing](#contributing)
        
* [Tests](#tests)
        
* [Questions](#questions)
        
## Installation
        
To install necessary dependencies, run the following command:
        
\`\`\`
${dependencies}
\`\`\`
        
## Usage
${about}
${license}
        
## Contributing
        
${contributing}
## Tests
        
To run tests, run the following command:
        
\`\`\`
${tests}
\`\`\`
        
## Questions
![user profile image](${userImage})
${userBlog}

If you have any questions about the repo, open an issue or contact [${github}] directly at ${email}.
`;

}

