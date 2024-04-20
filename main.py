import requests
import json





def set_global_values():
    with open('config.json') as file:
        data = json.loads(file.read())
        global CLIENT_ID
        global ACCESS_TOKEN
        global REFRESH_TOKEN
        CLIENT_ID = data["client_id"]
        ACCESS_TOKEN = data["access_token"]
        REFRESH_TOKEN = data["refresh_token"]


def refresh_access_token():
    response = requests.post(
        "https://accounts.spotify.com/api/token",
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data=f"grant_type=refresh_token&refresh_token={ACCESS_TOKEN}&client_id={CLIENT_ID}"
    ).json()

    with open("config.json", 'r') as file:
        data = json.load(file)
    data["access_token"] = response["access_token"]
    data["refresh_token"] = response["refresh_token"]
    with open('config.json', 'w') as file:
        json.dump(data, file, indent=4)





def get_current_track():
    try:
        response =  requests.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            headers={
                "Authorization": "Bearer " + ACCESS_TOKEN
            }
        )

    except:
        return ""
    
    if response.status_code == 401:
        refresh_access_token()
        set_global_values()
        get_current_track()

    elif response.status_code == 204:
            return ""
    
    elif response.status_code == 200:
        response = response.json()
        return response["item"]["id"]


def like_track(track_id):
    if track_id == "":
        return
    return requests.put(
        "https://api.spotify.com/v1/me/tracks?ids=" + track_id,
        headers={
            "Authorization": "Bearer " + ACCESS_TOKEN,
        },
    )





set_global_values()
print( like_track( get_current_track() ) )
