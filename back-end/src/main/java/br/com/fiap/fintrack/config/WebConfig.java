package br.com.fiap.fintrack.config;

import br.com.fiap.fintrack.security.AuthenticationInterceptor;
import br.com.fiap.fintrack.security.CurrentUserArgumentResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.*;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AuthenticationInterceptor authenticationInterceptor;
    private final CurrentUserArgumentResolver currentUserArgumentResolver;

    @Autowired
    public WebConfig(AuthenticationInterceptor authenticationInterceptor,
                     CurrentUserArgumentResolver currentUserArgumentResolver) {
        this.authenticationInterceptor = authenticationInterceptor;
        this.currentUserArgumentResolver = currentUserArgumentResolver;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authenticationInterceptor);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentUserArgumentResolver);
    }
}
