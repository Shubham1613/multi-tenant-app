import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']
        self.group_name = f"user_{self.username}"

        # Join the group for the current user
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group when disconnected
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        recipient = data['recipient']
        message = data['message']

        # Notify the recipient via WebSocket
        await self.channel_layer.group_send(
            f"user_{recipient}",
            {
                "type": "send_notification",
                "message": f"New message from {self.username}: {message}"
            }
        )

    async def send_notification(self, event):
        # Send notification to the WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))

