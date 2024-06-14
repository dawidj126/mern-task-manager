const router = require("express").Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, userId: req.user._id });
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).send({ message: "Task not found" });
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).send({ message: "Task not found" });
        res.status(200).send({ message: "Task deleted" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
