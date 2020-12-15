import { IonSearchbar, IonSelect, IonSelectOption, IonButton, IonItem, IonInput, IonLabel, IonList, IonRow, IonCol, IonGrid } from '@ionic/react';
import Fire from './Fire';
import React, { useEffect, useState } from "react";
import shortid from 'shortid';

function App() {

  const [billObjList, setBillObjList] = useState(JSON.parse(localStorage.getItem('billContent')) || [])
  const [billList, setBillList] = useState([])
  const [searchText, setSearchText] = useState("")
  const [filteredBillList, setFilteredBillList] = useState([])
  const [filteredBillObjList, setFilteredBillObjList] = useState([])
  const [allBillObjList, setAllBillObjList] = useState([])
  const [billItemName, setSearchItem] = useState("")//useState(JSON.parse(localStorage.getItem('taskList')) || [])
  const [newPrice, setNewPrice] = useState('')
  const [newCount, setNewCount] = useState("")
  const [newTax, setNewTax] = useState("")
  const [newTaxedPrice, setNewTaxedPrice] = useState("")
  const price = 0;
  const taxedPrice = 0;
 
 

  let addNewItemToList = function(newBillItemName, newPrice, newCount, newTax) {
    let billObjListCopy = [...billObjList]
    let billItemObj = { "id" : shortid.generate(), "itemName": newBillItemName, "Price": newPrice, "Count": newCount, "Tax": newTax, "TaxedPrice": newPrice*newCount*(1-(newTax/100)) }
    billObjListCopy.push(billItemObj)
    setBillObjList(billObjListCopy)
    setSearchItem("")
    setNewPrice("")
    setNewCount("")
    setNewTax("")
    setNewTaxedPrice("")
    localStorage.setItem("billContent", JSON.stringify(billObjListCopy))
  }

  let saveNewBillToList = function(billName, billContent){
    let billListCopy = [...billList]
    
    let billObj = { "id" : shortid.generate(), "billName" : billName, "billContent" : billContent}
    billListCopy.push(billObj)
    setBillList(billListCopy)
    Fire.database().ref('bills').set(billListCopy);
    console.log(billListCopy)
    localStorage.setItem("bills", JSON.stringify(billListCopy))
  }

  let deleteTask = function(itemId) {
    let billObjListCopy = [...billObjList]
    let shortenedBillObjList = billObjListCopy.filter(billObjListItem => billObjListItem.id !== itemId)
    localStorage.setItem("billContent", JSON.stringify(shortenedBillObjList))
    setBillObjList(shortenedBillObjList)
  }

  useEffect(
    () => {
      Fire.database().ref("bills/").on("value", function(data) {
        let billListDB = data.val()
        setBillList(billListDB)
        setFilteredBillList(billListDB)
        let tmpBillObjList = []
        for(var k in billListDB){
          for(var i in billListDB[k]["billContent"]){
            tmpBillObjList.push(billListDB[k]["billContent"][i])
          }
        }
        let myArrSerialized = tmpBillObjList.map(e => JSON.stringify(e));
        const mySetSerialized = new Set(myArrSerialized);
        const myUniqueArrSerialized = [...mySetSerialized];
        const myUniqueArr = myUniqueArrSerialized.map(e => JSON.parse(e));
        setAllBillObjList(myUniqueArr)
        setFilteredBillObjList(myUniqueArr)
        console.log(billListDB)
      }, function (error) {
        console.log("Error: " + error.code)
      })
    }, []
  )

  useEffect(
    () => {
    let tempSearchResult = billList.filter(e => e.billName.includes(searchText))
    setFilteredBillList([...tempSearchResult])
    console.log("searchText = " + searchText)
    for(var k in billList){
      if(billList[k]["billName"] == searchText){
        setBillObjList(billList[k]["billContent"])
      }
    }
    },
    [searchText]
  )
  
  

  useEffect(
    () => {
     
      let tempSearchResult = allBillObjList.filter(e => e.itemName.includes(billItemName))
      setFilteredBillObjList([...tempSearchResult])
       
      for(var k in allBillObjList){
        if(allBillObjList[k]["itemName"] == billItemName){
          setNewPrice(allBillObjList[k]["Price"])
          setNewTax(allBillObjList[k]["Tax"])
        }
      }
    },
    [billItemName]
  )
  
  return (
    
    <div className="App">
      

      <IonItem>
      <IonSearchbar id="name-search" placeholder="Laskun nimi" value={searchText} onIonChange={e => setSearchText(e.detail.value)}></IonSearchbar>
      <IonLabel>{filteredBillList.length}</IonLabel>
      <IonSelect value={searchText} interface="action-sheet" id="name-list" onIonChange={e => setSearchText(e.detail.value)}>
          { filteredBillList.map( (singleName) => 
            <IonSelectOption value={singleName.billName} key={singleName.id}>{singleName.billName}</IonSelectOption>
          )

          }
      </IonSelect>
      </IonItem>
      <IonList>
        { billObjList.map( (singleTask) => 
          <IonItem key={singleTask.id}>
              <IonGrid>
                <IonRow>
                  <IonCol size="6">{singleTask.itemName}</IonCol>
                  <IonCol size="1">{singleTask.Price}€</IonCol>
                  <IonCol size="1">x {singleTask.Count}</IonCol>
                  <IonCol size="1">{singleTask.Tax}%</IonCol>
                  <IonCol size="1">{singleTask.TaxedPrice}€</IonCol>
                </IonRow>
              </IonGrid>
            <IonButton class="buttonRemove" onClick={() => deleteTask(singleTask.id)}>Poista</IonButton> 
          </IonItem>
          ) 
        }
      </IonList>
      <IonItem>
        <IonSearchbar class="searchItem" placeholder="Laskutettava asia" value={billItemName} onIonChange={e => setSearchItem(e.detail.value)}></IonSearchbar>
        <IonSelect value={billItemName} interface="action-sheet" id="name-list" onIonChange={e => setSearchItem(e.detail.value)}>
          { filteredBillObjList.map( (singleName) => 
            <IonSelectOption value={singleName.itemName} key={singleName.id}>{singleName.itemName}</IonSelectOption>
          )

          }
      </IonSelect>
      </IonItem>
      <IonItem class="inputPrice">
        <IonInput placeholder="Hinta" value={newPrice} onIonChange={ (e) => setNewPrice(e.target.value) }></IonInput>
      </IonItem>
      <IonItem class="inputCount">
        <IonInput placeholder="Määrä" value={newCount} onIonChange={ (e) => setNewCount(e.target.value) }></IonInput>
      </IonItem>
      <IonItem class="inputTax">
        <IonInput placeholder="Vero" value={newTax} onIonChange={ (e) => setNewTax(e.target.value) }></IonInput>
      </IonItem>
      <IonButton class="addNewButton"  onClick={() => addNewItemToList(billItemName, newPrice, newCount, newTax) }>Lisää uusi</IonButton>
      <IonItem>
        <IonLabel  position="floating">Veronton Hinta</IonLabel>
        <IonInput value={price} readonly="{{isReadonly}}" ></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel  position="floating">Kokonais Hinta</IonLabel>
        <IonInput value={taxedPrice} readonly="{{isReadonly}}"></IonInput>
      </IonItem>
      <IonButton class="buttonSave" onClick={() => saveNewBillToList(searchText, billObjList)}>Tallenna</IonButton>
      <IonButton class="buttonPrint">Tulosta PDF</IonButton>

      
      
    </div>
  );

}

export default App;
