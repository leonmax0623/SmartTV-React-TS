import {OKFeed} from 'shared/collections/OkFeed';

const refreshGroupMessages = function(api, groupId, amount) {
  try {
    const result = api.getWall(groupId, amount)

    let messages = [];
    if (result.data.entities && result.data.entities.media_topics) {
      const {group_photos, videos} = result.data.entities;
      
      result.data.entities.media_topics.map(item => item.media).forEach(item => {
        let content = []  
        item.forEach((i, index) => {
          content[index] = {
            type: i.type
          };
          if (i.type === 'text') {
            content[index].text = i.text;
          } else if (i.type === 'video') {
            const currentVideo = i.movie_refs[0]
            const videoInfo = videos.find(video => video.ref === currentVideo);

            content[index].img = videoInfo.base_thumbnail_url;
            content[index].title = videoInfo.title;
          } else if (i.type === 'movie') {
            const currentVideo = i.movie_refs[0]
            const videoInfo = videos.find(video => video.ref === currentVideo);

            content[index].img = videoInfo.base_thumbnail_url;
            content[index].title = videoInfo.title;
          } else if (i.type === 'photo') {
            const currentPhoto = i.photo_refs[0]
            const photoInfo = group_photos.find(photo => photo.ref === currentPhoto);

            content[index].img = photoInfo.pic_max;
          } else if (i.type === 'link') {
            content[index].title = i.title;
            content[index].description = i.description;
            content[index].img = i.url_image;
            content[index].type = i.type;
            content[index].domain = i.domain;
            content[index].url = i.url;
          }
        });
        messages.push(content);
      })
    }

    OKFeed.update({groupId: groupId}, {
      $set: {
        messages: messages,
        lastUpdate: new Date(),
        lock: false,
      },
    }, {
      upsert: true,
    });
  } catch (e) {
    // TODO: Inform on a network error, timeout, or HTTP error in the 400 or 500 range.
    console.log(e);
    return;
  }
};

const refreshGroupInfo = function(api, groupId) {
  try {
    const result = api.groupGetInfo(groupId);

    if (result && result.data && result.data[0]) {
      OKFeed.update({groupId: groupId}, {
        $set: {
          name: result.data[0].name,
          lastUpdate: new Date(),
          lock: false,
        },
      }, {
        upsert: true,
      });
    }

  } catch (e) {
    // TODO: Inform on a network error, timeout, or HTTP error in the 400 or 500 range.
    console.log(e);
    return;
  }
};

export {refreshGroupMessages, refreshGroupInfo}