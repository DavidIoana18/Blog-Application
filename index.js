import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let postRecipes = [];
let recipeCounter = 1;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs", {recipes: postRecipes});
})

 app.get("/submit", (req, res) => {
    
     res.render("recipe.ejs", {recipe: null, isEdit: false});
})
app.post("/add", (req, res) =>{
    let name = req.body["name"];
    let ingredients = req.body["ingredients"];
    let prep = req.body["prepTime"];
    let pTimeUnit = req.body["prepTimeUnit"];
    let cooking = req.body["cookTime"];
    let cTimeUnit = req.body["cookTimeUnit"];
    let servings =  req.body["servings"];
    let instructions = req.body["recipeInstructions"];

    // Create the object for the recipe
    let recipe={
        id: recipeCounter++,
        name: name,
        ingredients: ingredients,
        prepTime: prep,
        prepTimeUnit: pTimeUnit,
        cookTime: cooking,
        cookTimeUnit: cTimeUnit,
        servings: servings,
        instructions: instructions
    };

    // Add recipe to recipe list
    postRecipes.push(recipe);

    res.redirect("/");
})

app.get("/view/:id", (req, res) =>{{
    const recipeId = req.params.id; //always is a string
    const recipe = postRecipes.find(recipe => recipe.id.toString() === recipeId);
    if (!recipe){
        return res.status(404).send("Recipe don't exist");
    }
    res.render("view.ejs", {recipe: recipe, isEdit: false});
}})

app.get("/edit/:id", (req, res) =>{
    const recipeId =  req.params.id;
    const recipe = postRecipes.find(recipe => recipe.id.toString() === recipeId);
    if(!recipe){
        return res.status(404).send("Recipe not found!");
    }

    res.render("recipe.ejs", {recipe: recipe, isEdit: true});
})

app.post("/edit/:id", (req, res) =>{
    const recipeId = req.params.id;
    const recipe = postRecipes.find(recipe => recipe.id.toString() === recipeId);
    if(!recipe){
        return res.status(404).send("Recipe not found!");
    }
    recipe.name = req.body["name"];
    recipe.ingredients = req.body["ingredients"];
    recipe.prepTime = req.body["prepTime"];
    recipe.prepTimeUnit = req.body["prepTimeUnit"];
    recipe.cookTime = req.body["cookTime"];
    recipe.cookTimeUnit = req.body["cookTimeUnit"];
    recipe.servings = req.body["servings"];
    recipe.instructions = req.body["recipeInstructions"];

    res.render("view.ejs", {recipe: recipe, isEdit: false});
})

app.post("/delete/:id", (req, res) =>{
    const recipeId = req.params.id;
    const recipeIndex = postRecipes.findIndex(recipe => recipe.id.toString() === recipeId);
    if(!recipeId){
        return res.status(404).send("Recipe not found!");
    }
    
    postRecipes.splice(recipeIndex, 1);
    res.redirect("/");
})

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})