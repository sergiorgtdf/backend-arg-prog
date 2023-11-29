import Task from "../models/task.model.js";

// TODO: OK
export const getAllTask = async (req, res) => {
    try {
        const allTask = await Task.find({
            userId: req.user.id,
        }).populate("userId");
        res.status(200).json(allTask);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};

// TODO: ok - el bug es que si se pone un id, trae las tareas de otra persona
export const getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const taskFound = await Task.findById(id);
        if (!taskFound)
            return res.status(404).json({ message: "Task not found" });
        res.status(200).json(taskFound);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
};

// TODO: OK
export const createTask = async (req, res) => {
    const { title, description, completed, date } = req.body;
    console.log("Guardando tarea...");
    try {
        const newTask = new Task({
            title,
            description,
            completed,
            date,
            userId: req.user.id,
        });

        const taskSaved = await newTask.save();

        res.status(201).json(taskSaved);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

// TODO: ok
export const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        ).populate("userId");
        if (!updatedTask)
            return res.status(404).json({ message: "Task not found" });

        res.status(200).json({
            message: "Task updated successfully",
            updatedTask,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

// TODO: ok
export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const taskDeleted = await Task.findByIdAndDelete(id);
        if (!taskDeleted)
            return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};
