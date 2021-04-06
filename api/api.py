from flask_restful import Resource, Api
from flask import Flask, jsonify
from bs4 import BeautifulSoup
from boardgamegeek import BGGClient
import requests
import time

app = Flask(__name__)
api = Api(app)


class DDGames(Resource):

    def get(self, page="1"):
        """Inizializza e lancia lo scraping della lista dei giochi dalla pagina del sito

        :page: Pagina su cui fare lo scraping (default = 1)"""

        url = "https://www.dungeondice.it/366-timebomb?page="+str(page)

        print("...Scraping "+url+"...")

        response = requests.get(url)

        # Inizializzo motore di scraping
        soup = BeautifulSoup(response.text, "html.parser")

        # Catturo i prodotti
        games = soup.select('.products article')
        pagesCount = int(soup.select(
            '.page-list-item:nth-last-child(2) > a')[0].get_text())

        game_list = []
        for game in games:
            game_link = game.select(".product-title > a")[0]
            game_title = game_link.get_text()
            game_img = game.select(".product-thumbnail > img")[0]['src']
            game_url = game_link["href"]
            game_price = game.find("span", itemprop="price").get_text()
            game_price_regular = game.select(".regular-price")[0].get_text()
            game_price_discount = game.select(
                ".discount-percentage")[0].get_text()

            # Costruzione dell'oggetto
            g = {"title": game_title, "img": game_img, "price": game_price, "url": game_url,
                 "regular_price": game_price_regular, "discount": game_price_discount}

            game_list.append(dict(g))

        results = {}
        # Ora ho tutti i prodotti in game_list
        results["results"] = game_list
        # E il numero massimo di pagine
        results["info"] = {'pages': pagesCount}

        return results


class BGGGame(Resource):

    def get(self, title):
        """Cerca e recupera informazioni sul titolo dal portale BoardGameGeek

        :title: Titolo del gioco"""

        bgg = BGGClient()

        # Inizializzo oggetto
        bgg_game_īd = ""
        bgg_game_url = ""
        bgg_game_title = ""
        bgg_game_rating = 0
        bgg_searched = False

        try:
            # Cerco il titolo direttamente
            g = bgg.game(title)
        except Exception:
            # Titolo non trovato, provo a fare una ricerca
            # Se ci sono risultati, prendo il primo titolo
            try:
                g_search = bgg.search(title)
                print("Search for " + title)
                g = bgg.game(game_id=g_search[0].id)
                bgg_searched = True
            except Exception:
                g = None

        if (hasattr(g, 'name')):
            bgg_game_title = g.name
            bgg_game_rating = round(float(g.rating_average), 1)
            bgg_game_url = "https://boardgamegeek.com/boardgame/" + str(g.id)

        bgg_info = {"bgg_title": bgg_game_title,
                    "bgg_rating": bgg_game_rating, "bgg_url": bgg_game_url, "bgg_searched": bgg_searched}

        return bgg_info


api.add_resource(DDGames, '/api/timebomb/',
                 '/api/timebomb/<string:page>', endpoint="games")

api.add_resource(BGGGame, '/api/game/<string:title>', endpoint='game')

if __name__ == '__main__':

    app.run(debug=True)
