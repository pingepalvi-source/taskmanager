package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {

    // Find tasks by completion status
    List<Task> findByCompleted(boolean completed);

    // Find tasks by title containing keyword (case-insensitive)
    List<Task> findByTitleContainingIgnoreCase(String keyword);
}
