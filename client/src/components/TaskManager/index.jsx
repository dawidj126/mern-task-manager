import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get("http://localhost:8087/api/tasks", {
                    headers: { "x-auth-token": token },
                });
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks", error);
            }
        };
        fetchTasks();
    }, []);

    const handleChange = ({ currentTarget: input }) => {
        setNewTask({ ...newTask, [input.name]: input.value });
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.post("http://localhost:8087/api/tasks", newTask, {
                headers: { "x-auth-token": token },
            });
            setTasks([...tasks, data]);
            setNewTask({ title: "", description: "" });
        } catch (error) {
            setError("Error adding task");
            console.error("Error adding task", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8087/api/tasks/${taskId}`, {
                headers: { "x-auth-token": token },
            });
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            setError("Error deleting task");
            console.error("Error deleting task", error);
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const token = localStorage.getItem("token");
            const updatedTask = { ...task, completed: !task.completed };
            await axios.put(`http://localhost:8087/api/tasks/${task._id}`, updatedTask, {
                headers: { "x-auth-token": token },
            });
            setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t)));
        } catch (error) {
            setError("Error updating task");
            console.error("Error updating task", error);
        }
    };

    return (
        <div className={styles.task_manager_container}>
            <h1>Manage your tasks!</h1>
            <form onSubmit={handleAddTask} className={styles.form_container}>
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={newTask.title}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                <textarea
                    placeholder="Description"
                    name="description"
                    value={newTask.description}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.green_btn}>
                    Add Task
                </button>
                {error && <div className={styles.error_msg}>{error}</div>}
            </form>
            <div className={styles.tasks_container}>
                {tasks.map((task) => (
                    <div key={task._id} className={styles.task}>
                        <h2 className={task.completed ? styles.completed : ""}>{task.title}</h2>
                        <p>{task.description}</p>
                        <button onClick={() => handleToggleComplete(task)}>
                            {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                        </button>
                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskManager;
