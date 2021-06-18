const { User, Question } = require('../models')
async function newQuestion (request, response) {
    const username = response.locals.user.userId;
    const questionBody = request.body;
    const user = await User.findOne({where: { username: username }});
    
    try{
        await Question.create({
            question: questionBody.question,
            UserId: user.id
        })
        console.log("Well, reached here!")
        response.status(200).send(`Question recorded ${username}`)
    }
    catch(err){
        response.status(400).send(err)
    }
  }
  
  module.exports = {
    newQuestion
  }