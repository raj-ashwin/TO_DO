const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const e = require("express");
const app = express();
const _=require("lodash");


const p1=new Promise((resolve,reject)=>{
  resolve(
    mongoose.connect("mongodb+srv://ashwin-raj:ashwin%402004@cluster0.fnd1xhg.mongodb.net/?retryWrites=true&w=majority"));
});
// &w=majority
const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "red",
});
const item2 = new Item({
  name: "green",
});
const item3 = new Item({
  name: "blue",
});

const defaultArray = [item1, item2, item3];

const listSchema = mongoose.Schema({
  name: String,
  list: [itemSchema],
});

var List = mongoose.model("List", listSchema);
p1.then(

 const todo = async () => {
  // const fectchedItems=await Item.find();
  // console.log("fetched successfully")
  // fectchedItems.forEach(function(ite){
  // 	console.log(ite.name)
  // })

  // const date=require(__dirname+"/date.js")
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static("public"));

  app.get("/", async function (req, res) {
    // let day=date.getDay()
    console.log(req.body);
    try {
      if (defaultArray.length === 0) {
        await Item.insertMany(defaultArray);
        defaultArray.save();
        console.log("Data inserted successfully");
        res.redirect("/");
      } else {
        var foundItems = await Item.find();
        // console.log("Found",foundItems)

        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    } catch (error) {
      console.log("unsuccesful", error);
    }
  });
  app.post("/", async function (req, res) {
    //   console.log(req.body)

    const listName = req.body.button;
    const itemName = req.body.newItem;
    const item = new Item({
      name: itemName,
    });
    if (listName == "Today") {
      item.save();
      res.redirect("/");
    } else {
      try {
        let foundList = await List.findOne({ name: listName });

        if (!foundList) {
          foundList = new List({
            name: listName,
            list: defaultArray,
          });
          await foundList.save();
        } else {
          foundList.list.push(item);
          await foundList.save();
        }
        res.redirect("/" + listName);
      } catch (error) {
        console.log("hhahaha", error);
      }
    }
  });

  app.post("/delete", async function (req, res) {
    // console.log(req.body.Checkbox);
    todo();

    const deleteID = req.body.Checkbox;
    const listName = req.body.listName;
    console.log(deleteID);
    try {
      if (!mongoose.Types.ObjectId.isValid(deleteID)) {
        console.log("Invalid deleteID:", deleteID);
        return res.status(400).send("Invalid item ID");
      }
      

      if (listName === "Today") {
        const deleted = await Item.findByIdAndDelete(deleteID);
        console.log("deleted ID: ", deleteID);
        res.redirect("/");
      } else {
        await List.findOneAndUpdate(
          { name: listName },
          { $pull: { list: { _id: deleteID } } }
        );
        // const haha = await Item.findOneAndRemove({_id:deleteID})
        // console.log(haha);
        // List.updateOne({name:listName}, { $items: { name: 'foo' } })
        res.redirect("/" + listName);
      }
    }
    catch (error) {
      console.log("unable to delete", error);
    }
  });

  app.get("/:customListName", async function (req, res) {
    const listName = _.capitalize(req.params.customListName);
    todo();
    try {
      const findedone = await List.findOne({ name: listName });
      if (!findedone) {
        const listt = new List({
          name: listName,
          list: defaultArray,
        });
        console.log(listName);
        listt.save();
        res.redirect("/" + listName);
      } else {
        res.render("list", {
          listTitle: findedone.name,
          newListItems: findedone.list,
        });
        console.log("Exists");
      }
    } catch (error) {
      console.log("eroooooorr", error);
    }

    // res.redirect("/"+listName)
  });
  // app.get("/about",function(req,res){
  // 		res.render("about");
  // })
};
);
todo();
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
