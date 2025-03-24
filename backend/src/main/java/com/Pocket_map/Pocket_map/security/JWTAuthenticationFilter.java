package com.Pocket_map.Pocket_map.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getServletPath();
        
        // Skip filter for login and registration endpoints only
        if (path.equals("/api/login") || path.equals("/api/users") || path.equals("/api/user")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // For other endpoints including /api/verify-token, validate JWT
        Authentication auth = jwtService.getAuthentication(request);
        if (auth != null) {
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
            
        filterChain.doFilter(request, response);
    }
}