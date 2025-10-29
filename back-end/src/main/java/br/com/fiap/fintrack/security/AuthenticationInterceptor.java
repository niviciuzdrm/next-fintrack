package br.com.fiap.fintrack.security;

import br.com.fiap.fintrack.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Method;

@Component
public class AuthenticationInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public AuthenticationInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod hm = (HandlerMethod) handler;
        Method method = hm.getMethod();

        boolean methodAnnotated = method.isAnnotationPresent(Authenticated.class);
        boolean classAnnotated = hm.getBeanType().isAnnotationPresent(Authenticated.class);

        if (!methodAnnotated && !classAnnotated) {
            return true; // rota não exige autenticação
        }

        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        String token = auth.substring(7);
        String userId = jwtUtil.validateAndGetUserId(token);
        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        //expor userId para controllers
        request.setAttribute("userId", userId);
        return true;
    }
}
