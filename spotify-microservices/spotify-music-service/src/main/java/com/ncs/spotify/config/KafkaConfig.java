package com.ncs.spotify.config;

import com.ncs.spotify.kafka.TrackLikedEvent;
import com.ncs.spotify.kafka.TrackPlayedEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.groups.track-played-group}")
    private String trackPlayedGroup;

    @Value("${spring.kafka.groups.track-liked-group}")
    private String trackLikedGroup;

    private <T> ConcurrentKafkaListenerContainerFactory<String, T> factoryForClass(Class<T> targetClass, String groupId) {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "com.ncs.spotify.kafka");
        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, targetClass.getName());
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        DefaultKafkaConsumerFactory<String, T> consumerFactory = new DefaultKafkaConsumerFactory<>(props);
        ConcurrentKafkaListenerContainerFactory<String, T> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TrackPlayedEvent> trackPlayedFactory() {
        return factoryForClass(TrackPlayedEvent.class, trackPlayedGroup);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TrackLikedEvent> trackLikedFactory() {
        return factoryForClass(TrackLikedEvent.class, trackLikedGroup);
    }
}
