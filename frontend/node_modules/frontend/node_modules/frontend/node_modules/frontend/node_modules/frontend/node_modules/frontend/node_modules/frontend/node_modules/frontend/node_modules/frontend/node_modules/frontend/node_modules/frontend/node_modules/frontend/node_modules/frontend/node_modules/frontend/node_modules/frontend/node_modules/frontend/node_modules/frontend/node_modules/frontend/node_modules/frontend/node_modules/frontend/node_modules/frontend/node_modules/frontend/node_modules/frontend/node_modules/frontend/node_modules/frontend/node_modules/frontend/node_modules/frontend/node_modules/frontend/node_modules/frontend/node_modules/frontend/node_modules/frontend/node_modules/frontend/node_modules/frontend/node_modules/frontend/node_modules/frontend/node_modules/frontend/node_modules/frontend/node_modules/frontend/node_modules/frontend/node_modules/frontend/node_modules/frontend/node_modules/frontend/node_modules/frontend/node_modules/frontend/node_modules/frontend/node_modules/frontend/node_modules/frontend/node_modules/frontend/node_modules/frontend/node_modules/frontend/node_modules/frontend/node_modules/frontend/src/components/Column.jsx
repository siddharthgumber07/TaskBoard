import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const Column = ({ columnId, title, tasks, onDelete }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`
            rounded-xl p-5 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 min-h-[450px] transition-all duration-300
            flex-1 shadow-md
            bg-gray-100 dark:bg-gray-800
            ${snapshot.isDraggingOver ? 'bg-blue-100 dark:bg-blue-900' : ''}
          `}
          style={{ margin: '0 8px' }}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            {title}
          </h3>

          {tasks.map((task, index) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`
                    mb-4 p-4  rounded-lg shadow-sm
                    transition-colors duration-200
                    ${snapshot.isDragging
                      ? 'bg-blue-200 dark:bg-blue-700'
                      : 'bg-white dark:bg-gray-700'}
                  `}
                >
                  <TaskCard task={task} onDelete={onDelete} />
                </div>
              )}
            </Draggable>
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
