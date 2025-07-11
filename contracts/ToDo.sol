// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract ToDo {
    address public owner;

    enum TaskStatus {
        Pending,
        Finished
    }

    constructor() {
        owner = msg.sender;
    }

    struct Task {
        string taskName;
        string description;
        uint startedTime;
        uint finishedTime;
        TaskStatus status;
    }

    // Mapping from user address to their task list
    mapping(address => Task[]) private userTasks;

    function addTask(
        string memory _taskName,
        string memory _description,
        uint _startedTime,
        uint _finishedTime
    ) public {
        Task memory newTask = Task({
            taskName: _taskName,
            description: _description,
            startedTime: _startedTime,
            finishedTime: _finishedTime,
            status: TaskStatus.Pending
        });

        userTasks[msg.sender].push(newTask); // Store task for sender
    }

    modifier validTaskIndex(uint index) {
        require(index < userTasks[msg.sender].length, "No task available");
        _;
    }

    function getMyTasksCount() public view returns (uint) {
        return userTasks[msg.sender].length;
    }

    function getMyTask(
        uint index
    )
        validTaskIndex(index)
        public
        view
        returns (string memory, string memory, uint, uint, TaskStatus)
    {
        Task memory t = userTasks[msg.sender][index];
        return (
            t.taskName,
            t.description,
            t.startedTime,
            t.finishedTime,
            t.status
        );
    }


    function maskAsFinished(uint index) public validTaskIndex(index) {
        Task storage task = userTasks[msg.sender][index];
        task.status = TaskStatus.Finished;       
    }

    function getAllTasks() public view returns (Task[] memory){
        return userTasks[msg.sender];
    }
}
