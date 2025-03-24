package com.Pocket_map.Pocket_map.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Pocket_map.Pocket_map.model.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByStartDateBetween(LocalDateTime start, LocalDateTime end);
    List<Schedule> findByUserId(Long userId);
}