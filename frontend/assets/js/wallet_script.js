import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";

// Function to handle the subscribe button click event
async function handleSubscribe(signer, userAccount) {
  try {
    const _signer = signer;

    await PushAPI.channels.subscribe({
      signer: _signer,
      channelAddress: 'eip155:5:0x850E31A514CC4da6A40fb28D0AE5cB854C8C2EbD',  // Channel address
      userAddress: `eip155:5:${userAccount}`,
      onSuccess: () => {
        console.log('opt in success');
        alert("Successfully subscribed to the channel");
      },
      onError: (error) => {
        console.error('opt in error', error);
        alert("Error subscribing to the channel");
      },
      env: 'staging'
    });
  } catch (error) {
    console.error(error);
  }
}

async function getNotifications(userAccount) {
  try {
    const notifications = await PushAPI.user.getFeeds({
      user: `eip155:5:${userAccount}`,
      env: 'staging'
    });
    console.log("Notifications", notifications);
    displayNotifications(notifications); // Call the function to display notifications
  } catch (error) {
    console.error("Error fetching notifications", error);
  }
}

function displayNotifications(notifications) {
  const container = document.getElementById('notifications-container');

  // Clear any existing notifications in the container
  container.innerHTML = '';

  // Loop through each notification and create HTML elements
  notifications.forEach(notification => {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('notification');
    notificationElement.innerHTML = `
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      <a href="${notification.url}" target="_blank">${notification.cta}</a>
    `;
    container.appendChild(notificationElement);
  });
}

function showErrorMessage(message) {
  alert(message);
}

document.addEventListener('DOMContentLoaded', function() {
  var walletButton = document.getElementById('wallet-button');
  var walletAddressElement = document.getElementById('wallet-address');
  var subscribeButton = document.getElementById('subscribe');
  var seeNotificationsButton = document.getElementById('see-notifications');
  var signer; // Declare the signer variable
  var account; // Declare the account variable

  // Retrieve the stored values from localStorage
  var storedAccount = localStorage.getItem('account');
  var storedSigner = localStorage.getItem('signer');

  // Check if the stored values exist
  if (storedAccount && storedSigner) {
    // Set the values from localStorage
    account = storedAccount;
    signer = ethers.Wallet.fromMnemonic(JSON.parse(storedSigner)).connect(provider);
  }


  // to check if metamask is installed
  if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
    var walletAddress = window.ethereum.selectedAddress;
    walletAddressElement.textContent = 'Wallet Address: ' + walletAddress;
    walletButton.innerHTML = 'Successfully Connected';
  }

  if (walletButton) {
    walletButton.addEventListener('click', function() {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(async function(accounts) {
            var walletAddress = accounts[0];
            walletAddressElement.textContent = 'Wallet Address: ' + walletAddress;
            walletButton.innerHTML = 'Successfully Connected';

            account = accounts[0];
            var provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();

            // Store the values in localStorage
            localStorage.setItem('account', account);
            localStorage.setItem('signer', JSON.stringify(signer));

            console.log("Account", account);
            console.log("Signer", signer);

            

            // await getNotifications(account);
          })
          .catch(function(error) {
            console.error(error);
          });
      } else {
        console.error('Please install MetaMask to connect your wallet.');
      }
    });
  }
  subscribeButton.addEventListener('click', async function() {
    if (!signer || !account) {
      // Display an error message to the user indicating that the wallet is not connected
      showErrorMessage("Please connect your wallet first.");     
      return;
    }

    await handleSubscribe(signer, account);
  });

  if (seeNotificationsButton) {
    seeNotificationsButton.addEventListener('click', async function() {
      if (!signer || !account) {
        // Display an error message to the user indicating that the wallet is not connected
        showErrorMessage("Please connect your wallet first.");     
        return;
      }
      await getNotifications(account); // Call the function to get and display notifications
    });
  }


});
