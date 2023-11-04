    /*const movies = await AsyncStorage.getItem(email);
    console.log('movies----', JSON.parse(movies));
    if (movies) {
      console.log('movies exist for this user', movies.favourites);
    } else {
      console.log('movies dont exist for this user');
      //add movie to async storage
      const value = [route.params.title];
      try {
        //await AsyncStorage.setItem(email, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
      //AsyncStorage.setItem(email, JSON.stringify(value));
      //console.log(AsyncStorage.getItem(email));
    }*/
    // add show to favs in async storage
    //console.log('adding to favs');
    // console.log('signed in ', signedIn);
    /* if (signedIn) {
      console.log('mark as favourite');
      firestore()
        .collection('Users')
        .doc(email)
        .update({
          favourites: firestore.FieldValue.arrayUnion(route.params.title),
        });
      setFav(true);
    } else {
      //console.log('Login in first');
    }*/

     /*firestore()
          .collection('Users')
          .doc(email)
          .get()
          .then(querySnapshot => {
            //console.log(querySnapshot.data().email);
            const favShows = querySnapshot.data().favourites;
            //console.log(favShows);
            //AsyncStorage.setItem('favourites', JSON.stringify(favShows));
            const check = favShows.includes(route.params.title);
            //console.log(check);
            setFav(check);
          });*/