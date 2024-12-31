from django.http import JsonResponse

def send_message(request):
    sender = request.user.username  # Assume user is logged in
    recipient = request.POST.get('recipient')
    message = request.POST.get('message')

    # Save the message to the database (optional)
    # Message.objects.create(sender=sender, recipient=recipient, content=message)

    return JsonResponse({'status': 'Message sent successfully'})

