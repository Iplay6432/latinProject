import json
import time

def add_post(title, date, location, how_to_get_there, views, customs, hotel_info, where_to_eat, history, map_image):
    posts_file_path = ''

    with open(posts_file_path, 'r') as file:
        posts = json.load(file)

    new_post = {
        'id': str(int(time.time() * 1000)),
        'title': title,
        'date': date,
        'location': location,
        'howToGetThere': how_to_get_there,
        'views': views,
        'customs': customs,
        'hotelInfo': hotel_info,
        'whereToEat': where_to_eat,
        'history': history,
        'mapImage': map_image
    }

    posts.append(new_post)

    with open(posts_file_path, 'w') as file:
        json.dump(posts, file, indent=2)

if __name__ == '__main__':
    title = input('Enter post title: ')
    date = input('Enter post date (YYYY-MM-DD): ')
    location = input('Enter post location: ')
    how_to_get_there = input('Enter how to get there: ')
    
    views = []
    while True:
        view_text = input('Enter view text (or press enter to finish): ')
        if not view_text:
            break
        view_image = input('Enter view image filename: ')
        views.append({'text': view_text, 'image': view_image})
    
    customs = input('Enter customs: ')
    hotel_info = input('Enter hotel info: ')
    where_to_eat = input('Enter where to eat: ')
    history = input('Enter history: ')
    map_image = input('Enter map image filename: ')

    add_post(title, date, location, how_to_get_there, views, customs, hotel_info, where_to_eat, history, map_image)
    print('Post added successfully.')