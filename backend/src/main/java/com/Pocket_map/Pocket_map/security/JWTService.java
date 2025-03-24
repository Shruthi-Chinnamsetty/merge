package com.Pocket_map.Pocket_map.security;

import java.util.ArrayList;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class JWTService {
    static final long EXPIRATIONTIME = 864_000_000; // 1 day in milliseconds
    
    @Value("${jwt.secret}")
    private String signingKey;
    
    static final String PREFIX = "Bearer";

    public void addToken(HttpServletResponse res, String username) {
        SecretKey key = Keys.hmacShaKeyFor(signingKey.getBytes());
        String jwtToken = Jwts.builder()
            .setSubject(username)
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
            .signWith(key)
            .compact();
        
        res.addHeader("Authorization", PREFIX + " " + jwtToken);
        res.addHeader("Access-Control-Expose-Headers", "Authorization");
    }

    public Authentication getAuthentication(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        System.out.println("Auth header: " + token);
        
        if (token == null || !token.startsWith(PREFIX + " ")) {
            return null;
        }

        try {
            // Extract the token without the prefix
            String actualToken = token.replace(PREFIX + " ", "");
            
            // Create key from the same secret used in token generation
            SecretKey key = Keys.hmacShaKeyFor(signingKey.getBytes());
            
            // Parse and validate token
            String user = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(actualToken)
                .getBody()
                .getSubject();
            
            if (user != null) {
                System.out.println("Authenticated user: " + user);
                // Create authentication object with empty authorities
                return new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
            }
        } catch (Exception e) {
            System.err.println("Error verifying JWT token: " + e.getMessage());
            e.printStackTrace();
        }
        
        return null;
    }
}