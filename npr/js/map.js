require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/GeoJSONLayer",
  "esri/Graphic",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/symbols/WebStyleSymbol",
  "esri/tasks/support/Query",
  "esri/geometry/SpatialReference",
  "esri/Basemap",
  "esri/geometry/support/webMercatorUtils",
  "esri/widgets/Expand",
  "esri/widgets/BasemapGallery",
  "esri/geometry/Polyline",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/UniqueValueRenderer"
], function(
    Map,
    SceneView,
    GraphicsLayer,
    FeatureLayer,
    GeoJSONLayer,
    Graphic,
    SketchViewModel,
    WebStyleSymbol,
    Query,
    SpatialReference,
    Basemap,
    webMercatorUtils,
    Expand,
    BasemapGallery,
    Polyline,
    SimpleLineSymbol,
    UniqueValueRenderer
) {
  // the layer where the graphics are sketched
  const gLayer = new GraphicsLayer();


  var basemap = new Basemap({
    portalItem: {
      id: "8dda0e7b5e2d4fafa80132d59122268c"  // WGS84 Streets Vector webmap
    }
  });

  const map = new Map({
    basemap: "satellite",
    //basemap: basemap,wgs84
    layers: [gLayer],
    ground: "world-elevation",
  });

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      position: [-98.634766, 13.503629, 5000000],
      heading: 0,
      tilt: 30.35
    },
  });

  view.extent = {
    xmin: -9177882,
    ymin: 4246761,
    xmax: -9176720,
    ymax: 4247967,
    spatialReference:{ wkid: 4326 }
  };

  var basemapGallery = new BasemapGallery({
    view: view,
    container: document.createElement("div")
  });

  var bgExpand = new Expand({
    view: view,
    content: basemapGallery
  });

  basemapGallery.watch("activeBasemap", function() {
    var mobileSize =
        view.heightBreakpoint === "xsmall" ||
        view.widthBreakpoint === "xsmall";

    if (mobileSize) {
      bgExpand.collapse();
    }
  });

  var polyline = new Polyline({
    paths: [
      [-118.29026, 34.1816],
      [-118.26451, 34.09664]
    ]
  });

  // Create a symbol for drawing the line
  var lineSymbol = new SimpleLineSymbol({
    color: [226, 119, 40],
    width: 4
  });

  // Create a line graphic
  var polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: lineSymbol
  })

  // Add the graphic to the view
  view.graphics.add(polylineGraphic);

  // Add the expand instance to the ui

  view.ui.add(bgExpand, "bottom-right");

const class1 = {
  type: "simple-line", // autocasts as new SimpleLineSymbol()
  //color: "#30ffea",
  color: "green",
  width: 3,
  style: "solid"
};

const class2 = {
  type: "simple-line", // autocasts as new SimpleLineSymbol()
  //color: "#ff6207",
  color: "yellow",
  width: 3,
  style: "solid"
};

const class3 = {
  type: "simple-line", // autocasts as new SimpleLineSymbol()
  //color: "#ef37ac",
  color: "orange",
  width: 3,
  style: "solid"
};
  const url =
      "https://opendata.arcgis.com/datasets/4746b25f893a4e25b94ab571e8c4cf3d_0.geojson";

  const poiJSON =
      "data/poi.geojson";

  const template = {
    title: "Trail Info",
    content: "<b>Trail Name:</b> {NAME} <br> <b>Type:</b> Class {CLASS} <br> <b>Notes:</b> {TRLFEATTYPE}"
  };

  const renderer = {
    type: "unique-value", // autocasts as new UniqueValueRenderer()
    field: "CLASS",
    defaultSymbol: class1, // used to visualize all features not matching specified types
    defaultLabel: "Other trails", //  used in the legend for all other types not specified
    // used for specifying unique values
    uniqueValueInfos: [
      {
        value: "1", // code for Class 1
        symbol: class1,
        label: "template" // used in the legend to describe features with this symbol
      },
      {
        value: "2", // code for class 2
        symbol: class2,
        label: "template" // used in the legend to describe features with this symbol
      },
      {
        value: "3", // code for class 3
        symbol: class3,
        label: "template" // used in the legend to describe features with this symbol
      }
    ]
  };

  const geojsonLayer = new GeoJSONLayer({
    url: url,
    copyright: "National Park Service",
    popupTemplate: template,
    renderer: renderer
  });

  const poijsonlayer = new GeoJSONLayer({
    url: poiJSON
  });

  map.add(poijsonlayer);

  map.add(geojsonLayer);

  const labelClass = {
    // autocasts as new LabelClass()
    symbolLayers: [
      {
        type: "text", // autocasts as new TextSymbol3DLayer()
        material: {
          color: "black"
        },
        halo: {
          color: [255, 255, 255, 0.7],
          size: 2
        },
        size: 10
      }
    ],
    verticalOffset: {
      screenLength: 50,
      maxWorldLength: 2000,
      minWorldLength: 30
    },
    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.UNIT_NAME"
    }
  };

  const labelClass2 = {
    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.UNIT_NAME"
    },
    symbol: {
      type: "label-3d", // autocasts as new LabelSymbol3D()
      symbolLayers: [
        {
          type: "text", // autocasts as new TextSymbol3DLayer()
          material: {
            color: "black"
          },
          halo: {
            color: [255, 255, 255, 0.7],
            size: 2
          },
          size: 10
        }
      ],

      verticalOffset: {
        screenLength: 150,
        maxWorldLength: 2000,
        minWorldLength: 30
      },
      callout: {
        type: "line", // autocasts as new LineCallout3D()
        size: 0.5,
        color: [0, 0, 0],
        border: {
          color: [255, 255, 255, 0.7]
        }
      }
    }
  };

  var parkBound = new FeatureLayer({
    url:
        "https://services1.arcgis.com/fBc8EJBxQRMcHlei/ArcGIS/rest/services/NPS_Park_Boundaries/FeatureServer/0",
    labelingInfo: [labelClass2]
  });

  parkBound.renderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    symbol: {
      "color": [26, 26, 26, 255],
      "width": 4,
      "type": "simple-line",
      "style": "dot"
    }
  };

  $('#parkselect').on('change', function() {
    view.goTo(parks[this.value],{tilt: 40});
  });

  function sortlist() {
    var options = $('#parkselect option');
    var arr = options.map(function(_, o) {
      return {
        t: $(o).text(),
        v: o.value
      };
    }).get();
    arr.sort(function(o1, o2) {
      return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
    });
    options.each(function(i, o) {
      o.value = arr[i].v;
      $(o).text(arr[i].t);
    });
  };

  map.add(parkBound);

  var query = parkBound.createQuery();
  query.outFields = ["UNIT_NAME"];
  var parkslist = [];
  parkBound.queryFeatures(query)
      .then(function(response){
        parks = response.features;
        var parkselect = document.getElementById("parkselect");
        var i;
        for (i = 0; i < parks.length; i++) {
          currentPark = response.features[i].attributes.UNIT_NAME;
          parkslist.push(response.features[i].attributes.UNIT_NAME);
          parkvalue = i++;
          $('#parkselect').append('<option value='+parkvalue+'>'+currentPark+'</option>');
        };
        sortlist();
        document.getElementById("loading").innerHTML = "Select a Park";
      });


      function shiftCamera(deg) {
        var camera = view.camera.clone();
        camera.position.longitude += deg;
        return camera;
      }

      document
        .getElementById("default")
        .addEventListener("click", function() {
          view.goTo(
            {
                position: {
                  x: -113.93,
                  y: 48.60,
                  z: 2500,
                  spatialReference: {
                    wkid: 4326
                  }
              },
              heading: 45,
              tilt: 85
            },
          );
        });


  const blue = [82, 82, 122, 0.9];
  const white = [255, 255, 255, 0.8];

  // polygon symbol used for future implementation
  const extrudedPolygon = {
    type: "polygon-3d",
    symbolLayers: [
      {
        type: "extrude",
        size: 10, // extrude by 10 meters
        material: {
          color: white
        },
        edges: {
          type: "solid",
          size: "3px",
          color: blue
        }
      }
    ]
  };

  // polyline symbol used for sketching routes
  const route = {
    type: "line-3d",
    symbolLayers: [
      {
        type: "line",
        size: "3px",
        material: {
          color: blue
        }
      },
      {
        type: "line",
        size: "10px",
        material: {
          color: white
        }
      }
    ]
  };

  // point symbol used for future implementation
  const point = {
    type: "point-3d",
    symbolLayers: [
      {
        type: "icon",
        size: "20px",
        resource: { primitive: "kite" },
        outline: {
          color: blue,
          size: "3px"
        },
        material: {
          color: white
        }
      }
    ]
  };
  var lineid = 0;
  cpcoord = [];
  function crackPaths(){
    var i;
    for (i = 0; i < path.length; i++) {
      var test = webMercatorUtils.xyToLngLat(path[i][lineid], path[i][lineid]);
      cpcoord.push(test);
    };
    cpcoordstr = cpcoord.toString();
    bracektscoord = cpcoordstr.replace(/([-\d.]+),([-\d.]+),?/g, '[$1, $2], ').trim();
    cpcoordstr = cpcoordstr.replace(/([-\d.]+),([-\d.]+),?/g, '$1 $2, ').trim();
  };

  function reporter(){
    var objects = gLayer.graphics;
    var pointLat = gLayer.graphics.items[lineid].geometry.latitude;
    var pointLon = gLayer.graphics.items[lineid].geometry.longitude;
    prepath = gLayer.graphics.items[lineid].geometry.paths;
    path = gLayer.graphics.items[lineid].geometry.paths[lineid];
    crackPaths();
  };

  function sendRequest(searchTerm) {
    var url = "http://127.0.0.1:5500/index.html";
    url += '?' + $.param({
      'api-key': cpcoordstr,
      'end_date': "19440606",
      'sort': "newest"
    });
    return $.ajax({
      url: url,
      method: 'GET',
      q: searchTerm,
    });
  };

  const sketchVM = new SketchViewModel({
    layer: gLayer,
    view: view,
    pointSymbol: point,
    polygonSymbol: extrudedPolygon,
    polylineSymbol: route
  });

  // add an event listener for the Delete key to delete
  // the graphics that are currently being updated
  view.on("key-up", function(evt) {
    if (evt.key === "Delete") {
      gLayer.removeMany(sketchVM.updateGraphics);
      sketchVM.reset();
    }
  });

  // after drawing the geometry, enter the update mode to update the geometry
  // and the deactivate the buttons
  sketchVM.on("create", function(event) {
    if (event.state === "complete") {
      sketchVM.update(event.graphic);
      deactivateButtons();
      reporter();
      $('#line').after(`   <div id="menu">
      <br>
        <form id = "create_report_form">
            <div><label>Trail Name:&nbsp</label><input placeholder="" name="report_name"></div><br>
        <div>
            <label>Difficulty:&nbsp&nbsp&nbsp</label> 
          <select name="report_type">
            <option name="report_type" value="class1">Class 1</option>
            <option name="report_type" value="class2">Class 2</option>
            <option name="report_type" value="class3">Class 3</option>
            <option name="report_type" value="class4">Class 4</option>
            <option name="report_type" value="class5">Class 5</option>
            <option name="report_type" value="unk">unknown</option>
          </select>&nbsp&nbsp<a href="http://climber.org/data/decimal.html" target="_blank">&#10067;</a>

        </div><br>
        <div><label>Notes:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</label><input placeholder="" name="report_notes"></div><br>
        <div><label>Coordiantes:&nbsp</label><input placeholder="" name="report_object" value="` + cpcoordstr + '" readonly></div><br>' +
          '<button type="submit" class="esri-button" id="report_submit_btn" onclick="reportall()">'+
          '<span ></span> Submit'+
          '</button>'+
          '</form>'+
          '</div>');
      lineid++;
      cpcoord = [];
    }
  });

  const drawButtons = Array.prototype.slice.call(
      document.getElementsByClassName("esri-button")
  );

  // set event listeners to activate sketching graphics
  drawButtons.forEach(function(btn) {
    btn.addEventListener("click", function(event) {
      deactivateButtons();
      event.target.classList.add("esri-button--secondary");
      // to activate sketching the create method is called passing in the geometry type
      // from the data-type attribute of the html element
      sketchVM.create(event.target.getAttribute("data-type"));
    });
  });

  function deactivateButtons() {
    drawButtons.forEach(function(element) {
      element.classList.remove("esri-button--secondary");

    });
  }

  view.ui.add("sketchPanel", "top-right");
});