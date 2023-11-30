import Task from "../models/task.model.js";

// TODO: OK
export const getAllTasks = async (req, res) => {
    try {
        const allTasks = await Task.find({
            user: req.user.id,
        }).populate("user"); //todo: falta filtrar por usuario

        res.status(200).json(allTasks);
    } catch (error) {
        console.log(error.message);
        res.status(400).json(error.message);
    }
};

// TODO: ok
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
            user: req.user.id,
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
        ).populate("user");
        if (!updatedTask)
            return res.status(404).json({ message: "Tarea no encontrada" });

        res.status(200).json(updatedTask);
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
