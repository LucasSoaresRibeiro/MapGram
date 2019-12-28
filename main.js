require([
  "dojo/request",
  "esri/Map",
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/layers/TileLayer",
  "esri/layers/GeoJSONLayer",
  "esri/layers/VectorTileLayer",
  "esri/layers/GraphicsLayer",
  "esri/Basemap",
  "esri/Graphic",
  "esri/PopupTemplate",
  "esri/geometry/Point",
  "esri/geometry/Mesh",
], function (request, Map, WebScene, SceneView, TileLayer, GeoJSONLayer, VectorTileLayer, GraphicsLayer, Basemap, Graphic, PopupTemplate, Point, Mesh) {

  const R = 6358137; // approximate radius of the Earth in m
  const offset = 300000; // offset from the ground used for the clouds

  var useWebScene = false;

  var map;
  var defaultInstagramUsername = 'instagram';
  var lightingConfig = {}

  if(useWebScene) {

    map = new WebScene({
      portalItem: {
        id: "a467ef1140de4e88acf34d38df9fb869"
      }
    });
    

  } else {

    map = new Map();

    var tileLayer = new VectorTileLayer({
      // url: "https://jsapi.maps.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db/resources/styles/root.json"
      portalItem: {
        
        // Mid Century
        // id: "7675d44bb1e4428aa2c30a9b68f97822"
        
        // Modern Antique
        id: "effe3475f05a4d608e66fd6eeb2113c0"

        // Colored Pencil
        // id: "4cf7e1fb9f254dcda9c8fbadb15cf0f8"

        // Newspaper
        // id: "dfb04de5f3144a80bc3f9f336228d24a"

        // Community
        // id: "273bf8d5c8ac400183fc24e109d20bcf"
      }
    });
    map.add(tileLayer);

    lightingConfig = {
      directShadowsEnabled: false,
      date: "Sun Jun 23 2019 14:00:00 GMT+0200 (Central European Summer Time)"
    }

  }

  // Create the SceneView
  var view = new SceneView({
    container: "viewDiv",
    map: map,
    alphaCompositingEnabled: true,
    qualityProfile: "high",
    environment: {
      background: {
        type: "color",
        color: [255, 252, 244, 0]
      },
      starsEnabled: false,
      atmosphereEnabled: false,
      lighting: lightingConfig
    },
    // constraints: {
    //   altitude: {
    //     min: 10000000,
    //     max: 25000000
    //   }
    // },
    popup: {
      dockEnabled: true,
      dockOptions: {
        position: "top-right",
        breakpoint: true,
        buttonEnabled: true
      },
      collapseEnabled: true
    },
    // highlightOptions: {
    //   color: [255, 255, 255],
    //   haloOpacity: 0.5
    // },
    // camera: {
    //   position: [7.654, 45.919, 5184],
    //   tilt: 80
    // }
  });

  // // Clouds
  // const cloudsSphere = Mesh.createSphere(new Point({
  //   x: 0, y: -90, z: -(2 * R + offset)
  // }), {
  //   size: 2 * (R + offset),
  //   material: {
  //     colorTexture: './img/clouds-nasa.png',
  //     doubleSided: false
  //   },
  //   densificationFactor: 4
  // });

  // cloudsSphere.components[0].shading = "flat";

  // const clouds = new Graphic({
  //   geometry: cloudsSphere,
  //   symbol: {
  //     type: "mesh-3d",
  //     symbolLayers: [{ type: "fill" }]
  //   }
  // });

  // view.graphics.add(clouds);

  var getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return defaultInstagramUsername;
    if (!results[2]) return defaultInstagramUsername;
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

  var adicionaResultado = function(points, instance){

    var map = instance.options.map;

    var markerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40]
    };

    var popupTemplate = new PopupTemplate({
        title: "{location}",
        content: `
        <div class="popupImage">
          <img src="{imageUrl}"/>
        </div>
        <div class="popupDescription">
          <p class="info">
            <span class="esri-icon-documentation"></span> {content}
          </p>
          <p class="info">
            <span class="esri-icon-favorites"></span> Likes: {likes}
          </p>
          <p class="info">
            <span class="esri-icon-favorites"></span> Comentários: {comments}
          </p>
        </div>
      `
    });
    
    let graphics = [];
    
    points.forEach(point_element => {
      var pointGraphic = new Graphic({
        geometry: point_element.geometry,
        attributes: point_element.attributes,
        // symbol: { type: "picture-marker", url: point_element.attributes.imageUrl, width: 100, height: 100 },
        symbol: { type: "picture-marker", url: "./img/marker_insta_pin.png", width: 70, height: 70, yoffset: 40 },
        // symbol: markerSymbol,
        popupTemplate: popupTemplate
      });
      graphics.push(pointGraphic);
    });

    // create layer
    var graphicsLayer = new GraphicsLayer();
    graphicsLayer.graphics.addMany(graphics);
    map.add(graphicsLayer);
  };

  new InstagramToArcGISGraphic({
    'username': getParameterByName('username'),
    'get_data': true,
    'map': map,
    'callback': adicionaResultado
  });

});