package com.hospital.appointment.repository;

import com.hospital.appointment.entity.DoctorAvailability;
import com.hospital.appointment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorAndAvailableDateOrderByStartTime(User doctor, LocalDate date);
    
    @Query("SELECT da FROM DoctorAvailability da WHERE da.doctor.id = :doctorId AND da.availableDate = :date")
    List<DoctorAvailability> findByDoctorIdAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    @Query("SELECT da FROM DoctorAvailability da WHERE da.doctor.id = :doctorId AND da.availableDate = :date AND da.isBooked = false")
    List<DoctorAvailability> findAvailableSlots(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    boolean existsByDoctorAndAvailableDateAndStartTimeAndEndTime(
        User doctor, LocalDate date, LocalTime startTime, LocalTime endTime);
}