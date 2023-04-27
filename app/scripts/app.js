document.onreadystatechange = function() {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit
      .then(function getClient(_client) {
        window.client = _client;
        client.events.on('app.activated', getUserAssets);
      })
      .catch(handleErr);
  }
};

async function getUserAssets(){
	try	{
		var emailAddress = "";
		
		await client.data.get("requester").then(function(data) {
			emailAddress = `${data.requester.email}`;
			//document.getElementById("email").innerHTML = emailAddress;
		})
		.catch(handleErr);
		let snipeUser = await client.request.invokeTemplate("getUser", { "context": { "email": emailAddress } });
		let snipeUserJSON = JSON.parse(snipeUser.response);
		var snipeUserID = snipeUserJSON.rows[0].id;
		let snipeUserAssets = await client.request.invokeTemplate("getUserAssets", { "context": { "snipeUserId": snipeUserID } });
		let snipeUserAssetsJSON = JSON.parse(snipeUserAssets.response);
		
		let container = document.getElementById("container");
		 
		 //Create the table element
		 let table = document.createElement("table");
		 
		 snipeUserAssetsJSON.rows.forEach((item) => {
			let tr = document.createElement("tr");
			
			let AssetImage = document.createElement("td");
			AssetImage.innerHTML = "<img src=\"" + item.image + "\" width=\"25\" height=\"25\" />";
			tr.appendChild(AssetImage);

			let AssetTag = document.createElement("td");
			AssetTag.innerHTML = "<a href=\"https://assets.creteschools.org/hardware/" + item.id + "\" target=\"_blank\">" + item.asset_tag + "</a>"
			tr.appendChild(AssetTag);
			
			let AssetName = document.createElement("td");
			AssetName.innerHTML = item.name;
			tr.appendChild(AssetName);
			
			table.appendChild(tr);
		 });
		 container.appendChild(table)
	}
	catch(err){handleErr(err)};
}

function handleErr(err = 'None') {
  console.error("Error occured. Details:", err);
}
