// script.js
function myFunction(x) {
    x.style.background = "#F0F0F0";
    x.style.border = "1px solid black";

}
function blurFunction(x) {
    x.style.background = "white";
    x.style.border = "none";
}

$(document).ready(function () {
    const clientId = '08e9fbdd16c542e688c4556dd77afe33';
    const clientSecret = 'ad1f03be4c11495e9729571c351171a9';
    const apiUrl = 'https://api.spotify.com/v1/search';
    $('#apiForm').submit(function (event) {
        event.preventDefault();
        const searchType = $('#searchType').val();
        const searchTerm = $('#searchTerm').val();

        $.ajax({
            url: 'https://accounts.spotify.com/api/token',
            type: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                'grant_type': 'client_credentials'
            },
            success: function (tokenResponse) {
                const accessToken = tokenResponse.access_token;

                let queryType;
                if (searchType === 'track') {
                    queryType = 'track';
                } else if (searchType === 'artist') {
                    queryType = 'artist';
                }

                $.ajax({
                    url: `${apiUrl}?q=${searchTerm}&type=${queryType}`,
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    },
                    method: 'GET',
                    success: function (data) {
                        displayData(data, searchType);
                    },
                    error: function (error) {
                        console.error('Error:', error);
                        alert('Error fetching information. Please try again.');
                    }
                });
            },
            error: function (error) {
                console.error('Error:', error);
                alert('Error fetching access token. Please try again.');
            }
        });
    });

    $('#clearData').click(function () {
        clearData();
    });

    function clearData() {
        const apiDataDiv = $('#apiData');
        const searchTermDiv = $('#searchTerm');

        if (apiDataDiv.children().length > 0) {
            apiDataDiv.empty();
            searchTermDiv.val('');

        } else if (searchTermDiv.val() !== '') {
            searchTermDiv.val('');
        }
        else {
            alert('No data to clear.');
        }
    }

    function displayData(data, searchType) {
        if (data.tracks) {
            const firstTrack = data.tracks.items[0];
            const imageUrl = firstTrack.album.images.length > 0
                ? firstTrack.album.images[0].url
                : 'https://via.placeholder.com/150';

            $('#apiData').html(`
                <h2 id="songTitle">${firstTrack.name}</h2>
                <img src="${imageUrl}" alt="Album Cover" style="max-width: 300px;">
                <p><a href="${firstTrack.external_urls.spotify}" target="_blank"><img src="song.png" id="song"></a></p>
                <p><label id="subtitle">Artist: </label>${firstTrack.artists[0].name}</p>
                <p><label id="subtitle">Album:  </label>${firstTrack.album.name}</p>
                <p><label id="subtitle">Release Date: </label> ${firstTrack.album.release_date}</p>
                <p><label id="subtitle">Popularity: </label> ${firstTrack.popularity}</p>
             
            `);
        } else if (data.artists) {
            const firstArtist = data.artists.items[0];
            const imageUrl = firstArtist.images.length > 0
                ? firstArtist.images[0].url
                : 'https://via.placeholder.com/150';

            $('#apiData').html(`
                <h2>${firstArtist.name}</h2>
                <img src="${imageUrl}" alt="Artist Image" style="max-width: 300px;">
                <p> <a href="${firstArtist.external_urls.spotify}" target="_blank"><img src="song.png" id="song"></a></p>
                <p>Genres: ${firstArtist.genres.join(', ')}</p>
                <p>Followers: ${firstArtist.followers.total}</p>
                <p>Popularity: ${firstArtist.popularity}</p>   
            `);
        }
    }
});
