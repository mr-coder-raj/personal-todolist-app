import { useEffect, useState } from "react";
import { FaEdit, FaTasks } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [view, setView] = useState("remaining");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const saveToLS = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const resetInput = () => {
    setTodo("");
    setDate("");
    setTime("");
  };

  const handleAdd = () => {
    if (todo.trim() === "") return;

    let datetime = null;
    if (date) {
      datetime = time ? `${date}T${time}` : `${date}T00:00`;
    }

    const newTodo = {
      id: uuidv4(),
      todo,
      isCompleted: false,
      datetime,
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    saveToLS(newTodos);
    resetInput();
  };

  const handleEdit = (e, id) => {
    const t = todos.find((i) => i.id === id);
    setTodo(t.todo);
    if (t.datetime) {
      setDate(t.datetime.split("T")[0]);
      setTime(t.datetime.split("T")[1] || "");
    } else {
      setDate("");
      setTime("");
    }
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleDelete = (e, id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleChange = (e) => setTodo(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleTimeChange = (e) => setTime(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const toggleComplete = (id, completed) => {
    const index = todos.findIndex((item) => item.id === id);
    if (index === -1) return;
    const newTodos = [...todos];
    newTodos[index].isCompleted = completed;
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const remainingTodos = todos.filter((t) => !t.isCompleted);
  const completedTodos = todos.filter((t) => t.isCompleted);

  const formatDateTime = (dtString) => {
    if (!dtString) return "No Date";
    const d = new Date(dtString);
    if (isNaN(d)) return "Invalid Date";
    return d.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-xl bg-[#1e1e2f] shadow-2xl rounded-3xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-cyan-400 tracking-wider flex items-center justify-center gap-3">
          <FaTasks /> TaskBlitz
        </h1>

        {/* Real-time Clock */}
        <div className="text-center mt-2 mb-4 bg-[#29293d] rounded-xl py-4 px-6 shadow-inner border border-[#3b3b5a]">
          <div className="text-3xl font-mono font-bold text-cyan-400 tracking-wide">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-400 mt-1 uppercase tracking-wider">
            {formatDate(currentTime)}
          </div>
        </div>


        {/* Input Section */}
        <div className="space-y-4">
          <input
            value={todo}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Add Tasks here!"
            className="w-full px-4 py-3 bg-[#29293d] border border-[#444] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <div className="flex gap-4">
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="flex-1 px-4 py-2 rounded-xl bg-[#29293d] border border-[#444] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="flex-1 px-4 py-2 rounded-xl bg-[#29293d] border border-[#444] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-bold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            ➕ Add Task
          </button>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center space-x-6 mb-6">
          <button
            onClick={() => setView("remaining")}
            className={`px-6 py-2 rounded-full font-semibold transition cursor-pointer
              ${view === "remaining"
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-[#29293d] text-gray-400 hover:bg-cyan-600 hover:text-white"}`}
          >
            Remaining Tasks ({remainingTodos.length})
          </button>
          <button
            onClick={() => setView("completed")}
            className={`px-6 py-2 rounded-full font-semibold transition cursor-pointer
              ${view === "completed"
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-[#29293d] text-gray-400 hover:bg-cyan-600 hover:text-white"}`}
          >
            Completed Tasks ({completedTodos.length})
          </button>
        </div>

        {/* Task List */}
        <section className="transition-opacity duration-500 ease-in-out" style={{ opacity: 1 }}>
          {view === "remaining" && (
            <>
              {remainingTodos.length === 0 ? (
                <p className="text-gray-400 italic text-center">No remaining tasks. Good job! 🎉</p>
              ) : (
                remainingTodos.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-[#3b3b5a]"
                  >
                    <div>
                      <p className="text-lg text-white">{item.todo}</p>
                      <p className="text-sm text-cyan-300 italic">
                        {formatDateTime(item.datetime)}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => toggleComplete(item.id, true)}
                        className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition cursor-pointer"
                      >
                        Completed
                      </button>
                      <button
                        onClick={(e) => handleEdit(e, item.id)}
                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-transform duration-300 hover:scale-105 cursor-pointer"
                      >
                        <FaEdit size={18} />
                        <span className="ml-2 hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-rose-600 text-white font-semibold shadow-md hover:bg-rose-500 transition-transform duration-300 hover:scale-105 cursor-pointer"
                      >
                        <AiFillDelete size={18} />
                        <span className="ml-2 hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {view === "completed" && (
            <>
              {completedTodos.length === 0 ? (
                <p className="text-gray-400 italic text-center">No completed tasks yet.</p>
              ) : (
                completedTodos.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 border-b border-[#3b3b5a]"
                  >
                    <div>
                      <p className="text-lg line-through text-gray-500">{item.todo}</p>
                      <p className="text-sm text-cyan-300 italic">
                        {formatDateTime(item.datetime)}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => toggleComplete(item.id, false)}
                        className="px-3 py-1 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition cursor-pointer"
                      >
                        Undo
                      </button>
                      <button
                        onClick={(e) => handleEdit(e, item.id)}
                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-transform duration-300 hover:scale-105 cursor-pointer"
                      >
                        <FaEdit size={18} />
                        <span className="ml-2 hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-rose-600 text-white font-semibold shadow-md hover:bg-rose-500 transition-transform duration-300 hover:scale-105 cursor-pointer"
                      >
                        <AiFillDelete size={18} />
                        <span className="ml-2 hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
