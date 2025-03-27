package com.Pocket_map.Pocket_map.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Pocket_map.Pocket_map.model.Schedule;
import com.Pocket_map.Pocket_map.repository.ScheduleRepository;

@Service
public class ScheduleService {
    @Autowired
    private ScheduleRepository scheduleRepository;
    
    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }
    
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }
    
    public Schedule updateSchedule(Long id, Schedule schedule) {
        Schedule existing = scheduleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Schedule not found"));

        existing.setDestinationName(schedule.getDestinationName());
        existing.setDistance(schedule.getDistance());
        existing.setCategory(schedule.getCategory());
        existing.setStartDate(schedule.getStartDate());
        existing.setEndDate(schedule.getEndDate());
        existing.setTravelMode(schedule.getTravelMode());
        existing.setStatus(schedule.getStatus());
        return scheduleRepository.save(existing);
    }
    
    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    public List<Schedule> getSchedulesByUser(Long userId) {
        return scheduleRepository.findByUserId(userId);
    }

    public Schedule findById(Long id) {
        return scheduleRepository.findById(id).orElse(null);
    }
}