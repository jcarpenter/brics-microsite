// export function spawnCube() {
//   var clone = cube.clone();
//   clone.position.copy(getCameraPosition());
//   // clone.quaternion.copy(getCameraOrientation());
//   clone.translateZ(-0.5);
//   sceneGL.add(clone);
// }

 export function getCameraPosition(vrFrameData, camera) {
  
  if(vrFrameData) {
    var pose = vrFrameData.pose;

    var pos = new THREE.Vector3(
      pose.position[0],
      pose.position[1],
      pose.position[2]
   );

    // var push = new THREE.Vector3(0, 0, 0);
    // push.transformDirection(dirMtx);
    // pos.addScaledVector(push, 0.125);

    return pos;
  } else {
    return camera.position;
  }
}

export function getCameraOrientation(vrFrameData, camera) {
  
  if(vrFrameData) {
    var pose = vrFrameData.pose;

    var ori = new THREE.Quaternion(
      pose.orientation[0],
      pose.orientation[1],
      pose.orientation[2],
      pose.orientation[3]
   );

    var dirMtx = new THREE.Matrix4();
    dirMtx.makeRotationFromQuaternion(ori);

    return ori;
  } else {
    return camera.quaternion;
  }
}


// Common ////////////////
