package main

import (
	"encoding/json"
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Post struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	UserID  int    `json:"userId"`
}

func main() {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatal("Failed to connect to RabbitMQ:", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Failed to open channel:", err)
	}
	defer ch.Close()

	PublishQueue, PQerr := ch.QueueDeclare(
		"postQueue",
		false,
		false,
		false,
		false,
		nil,
	)
	if PQerr != nil {
		log.Fatal("Failed to declare queue: ", PQerr)
	}

	for i := 0; i < 10; i++ {
		post := Post{
			Title:   fmt.Sprintf("Title %d", i),
			Content: fmt.Sprintf("Content %d", i),
			UserID:  7,
		}

		msgs, msgsErr := json.Marshal(post)
		if msgsErr != nil {
			log.Fatal("Failed to turn post to json: ", msgsErr)
		}

		err := ch.Publish(
			"",
			PublishQueue.Name,
			false,
			false,
			amqp.Publishing{
				ContentType: "application/json",
				Body:        msgs,
			},
		)

		if err != nil {
			log.Fatal("Failed to publush message: ", err)
		}

		fmt.Sprintf("Message %d sent", i)
	}

}
