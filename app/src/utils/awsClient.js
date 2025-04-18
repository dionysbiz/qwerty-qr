import { DynamoDBClient, ListTablesCommand, BatchGetItemCommand, ConditionCheckItemCommand, GetItemCommand, QueryCommand, ScanCommand, PutItemCommand} from '@aws-sdk/client-dynamodb';
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Blob } from 'blob-polyfill';
import { ReadableStream } from 'web-streams-polyfill';
if (typeof global.ReadableStream === 'undefined') {
    global.ReadableStream = ReadableStream;
}

const awsRegion = "eu-west-2"
const identityPoolId = 'eu-west-2:35e22f67-61ad-45fc-8a17-9014c4d90fe7'



async function initConnection() {
  // Ref: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-browser-credentials-cognito.html
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
    
  })
  return client;
};

export async function listTable() {
  const command = new ListTablesCommand({});
  try {
    const results = await initConnection().send(command);
    console.log(results.TableNames.join("\n"));
  } catch (err) {
    console.error(err);
  }
}

// Used in buyer dashboard
export async function queryOrdersByOrderer(fromAddr) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: 'orders',
    IndexName: 'fromAddr-blockNumber-index',
    // ProjectionExpression: "order_id, chain, fromAddr, toAddr, product_cover, product_name, product_id, buyer_name, buyer_email, delivery_addr1, delivery_addr2, currencyName, product_price, transactionHash",
    // FilterExpression: "toAddr = :val",
    // ExpressionAttributeValues: {":val": {"S": toAddr}},
    KeyConditions: {
      fromAddr: {
        "ComparisonOperator":"EQ",
        "AttributeValueList": [ {"S": fromAddr} ]
      }
    }
  };

  let results = {}
  const command = new QueryCommand(params);
  try {
    results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error(err);
  }

  return results
}

// Used in seller dashboard
export async function queryOrdersByReceiver(toAddr) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: 'orders',
    IndexName: 'toAddr-blockNumber-index',
    // ProjectionExpression: "order_id, chain, fromAddr, toAddr, product_cover, product_name, product_id, buyer_name, buyer_email, delivery_addr1, delivery_addr2, currencyName, product_price, transactionHash",
    // FilterExpression: "toAddr = :val",
    // ExpressionAttributeValues: {":val": {"S": toAddr}},
    KeyConditions: {
      toAddr: {
        "ComparisonOperator":"EQ",
        "AttributeValueList": [ {"S": toAddr} ]
      }
    }
  };

  let results = {}
  const command = new QueryCommand(params);
  try {
    results = await client.send(command);
    console.log("Query Orders table");
    console.log(results);
  } catch (err) {
    console.error(err);
  }

  return results;
}

// Used in seller dashboard to eliminated delivered order
export async function queryDeliveredOrdersByReceiver(toAddr) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: 'delivered_orders',
    IndexName: 'toAddr-blockNumber-index',
    // ProjectionExpression: "order_id, chain, fromAddr, toAddr, product_cover, product_name, product_id, buyer_name, buyer_email, delivery_addr1, delivery_addr2, currencyName, product_price, transactionHash",
    // FilterExpression: "toAddr = :val",
    // ExpressionAttributeValues: {":val": {"S": toAddr}},
    KeyConditions: {
      toAddr: {
        "ComparisonOperator":"EQ",
        "AttributeValueList": [ {"S": toAddr} ]
      }
    }
  };

  let results = {}
  const command = new QueryCommand(params);
  try {
    results = await client.send(command);
    console.log("Query Delivered Orders table");
    console.log(results);
  } catch (err) {
    console.error(err);
  }

  return results;
}

export async function queryIcoOrdersByAddr(addr) {
  console.log(addr)
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: 'ico_orders',
    IndexName: 'issue_addr-payment_create_time-index',
    // details_id, form_username, currency_code, form_email, form_amount	
    KeyConditions: {
      issue_addr: {
        "ComparisonOperator":"EQ",
        "AttributeValueList": [ {"S": addr} ]
      }
    }
  };

  let results = {}
  const command = new QueryCommand(params);
  try {
    results = await client.send(command);
    console.log("Query ICO Orders table Start");
    console.log(results);
  } catch (err) {
    console.error(err);
  }

  return results;
}

export async function queryDeilveredIcoOrdersByIssueAddr(fromAddr) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: 'delivered_ico',
    IndexName: 'fromAddr-blockNumber-index',
    // details_id, form_username, currency_code, form_email, form_amount	
    
    KeyConditions: {
      fromAddr: {
        "ComparisonOperator":"EQ",
        "AttributeValueList": [ {"S": fromAddr} ]
      }
    }
    
  };

  let results = {}
  const command = new QueryCommand(params);
  try {
    results = await client.send(command);
    console.log("Query ICO Delivered Orders table Start");
    console.log(results);
  } catch (err) {
    console.error(err);
  }

  return results;
}

export async function queryNotificationByAddr(addr) {
  console.log(addr)
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: 'notification_msg',
    IndexName: 'userAddr-index',
    // details_id, form_username, currency_code, form_email, form_amount	
    KeyConditions: {
      userAddr: {
        "ComparisonOperator":"EQ",
        "AttributeValueList": [ {"S": addr} ]
      }
    }
  };

  let results = {}
  const command = new QueryCommand(params);
  try {
    results = await client.send(command);
    console.log("Query Notification table Start");
    console.log(results);
  } catch (err) {
    console.error(err);
  }

  return results;
}

export async function queryNotificationReadByAddr(addr) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: 'notification_msg_read',
    IndexName: 'userAddr-index',
    // details_id, form_username, currency_code, form_email, form_amount	
    
    KeyConditions: {
      userAddr: {
        "ComparisonOperator":"EQ",
        "AttributeValueList": [ {"S": addr} ]
      }
    }
    
  };

  let results = {}
  const command = new QueryCommand(params);
  try {
    results = await client.send(command);
    console.log("Query notification_msg_read table Start");
    console.log(results);
  } catch (err) {
    console.error(err);
  }

  return results;
}

// Used in seller dashboard
export async function queryQROrdersByReceiver(toAddr) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: 'qrorders',
    IndexName: 'toAddr-blockNumber-index',
    // ProjectionExpression: "order_id, chain, fromAddr, toAddr, product_cover, product_name, product_id, buyer_name, buyer_email, delivery_addr1, delivery_addr2, currencyName, product_price, transactionHash",
    // FilterExpression: "toAddr = :val",
    // ExpressionAttributeValues: {":val": {"S": toAddr}},
    KeyConditions: {
      toAddr: {
        "ComparisonOperator":"EQ",
        "AttributeValueList": [ {"S": toAddr} ]
      }
    }
  };

  let results = {}
  const command = new QueryCommand(params);
  try {
    results = await client.send(command);
    console.log("Query Orders table");
    console.log(results);
  } catch (err) {
    console.error(err);
  }

  return results;
}

//----------------------------------Scan------------------------------

export async function scanTable(table) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: table,
    ProjectionExpression: "order_id, chain, fromAddr, toAddr, product_cover, product_name, product_id, buyer_name, buyer_email, delivery_addr1, delivery_addr2, currencyName, product_price, transactionHash",
    FilterExpression: "product_name = :val",
    ExpressionAttributeValues: {":val": {"S": "TestT777R2"}},
  };

  let results = {}
  const command = new ScanCommand(params);
  try {
    results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error(err);
  }

  return results;
}

export async function scanQROrders(toAddr) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
  })

  // ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax

  const params = {
    TableName: "qrorders",
    ProjectionExpression: "order_id, chainId, fromAddr, toAddr, itemName, cryptoNameShort, cryptoPriceEzread, transactionHash, createDate",
    //ProjectionExpression: "#ST, #AT",
    FilterExpression: "toAddr = :val",
    ExpressionAttributeValues: {":val": {"S": toAddr}},
  };

  let results = {}
  const command = new ScanCommand(params);
  try {
    results = await client.send(command);
    console.log("Scan QR orders Table on AWS");
    console.log(results);
    //console.log(results.Items);
  } catch (err) {
    console.error(err);
  }

  return results.Items;
}

//----------------------------------Insert/Update------------------------------

export async function putQrorder(item) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
    
  })

  // Ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
  /* Sample 
  const params = {
    TableName: "TABLE_NAME",
    Item: {
      CUSTOMER_ID: { N: "001" },
      CUSTOMER_NAME: { S: "Richard Roe" },
    },
  };
  */

  const params = {
    TableName: "qrorders",
    Item: item,
  };
  
  console.log(params)
  const command = new PutItemCommand(params);
  console.log(command)
  try {
    const results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error("Error during putQrorder")
    console.error(err);
  }
}


export async function putItem(table, item) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
    
  })

  // Ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
  /* Sample 
  const params = {
    TableName: "TABLE_NAME",
    Item: {
      CUSTOMER_ID: { N: "001" },
      CUSTOMER_NAME: { S: "Richard Roe" },
    },
  };
  */

  const params = {
    TableName: "orders",
    Item: item,
  };
  
  console.log(params)
  const command = new PutItemCommand(params);
  console.log(command)
  try {
    const results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error(err);
  }
}

export async function putItemDelivered(table, item) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
    
  })

  // Ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
  /* Sample 
  const params = {
    TableName: "TABLE_NAME",
    Item: {
      CUSTOMER_ID: { N: "001" },
      CUSTOMER_NAME: { S: "Richard Roe" },
    },
  };
  */

  const params = {
    TableName: "delivered_orders",
    Item: item,
  };
  
  console.log(params)
  const command = new PutItemCommand(params);
  console.log(command)
  try {
    const results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error(err);
  }
}

export async function putItemICO(item) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
    
  })

  // Ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
  /* Sample 
  const params = {
    TableName: "TABLE_NAME",
    Item: {
      CUSTOMER_ID: { N: "001" },
      CUSTOMER_NAME: { S: "Richard Roe" },
    },
  };
  */

  const params = {
    TableName: "ico_orders",
    Item: item,
  };
  
  console.log(params)
  const command = new PutItemCommand(params);
  console.log(command)
  try {
    const results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error(err);
  }
}

export async function putItemICODelivered(item) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
    
  })

  // Ref: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
  /* Sample 
  const params = {
    TableName: "TABLE_NAME",
    Item: {
      CUSTOMER_ID: { N: "001" },
      CUSTOMER_NAME: { S: "Richard Roe" },
    },
  };
  */

  const params = {
    TableName: "delivered_ico",
    Item: item,
  };
  
  console.log(params)
  const command = new PutItemCommand(params);
  console.log(command)
  try {
    const results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error(err);
  }
}

export async function putItemNotification(item) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
    
  })

  const params = {
    TableName: "notification_msg",
    Item: item,
  };
  
  console.log(params)
  const command = new PutItemCommand(params);
  console.log(command)
  try {
    const results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error(err);
  }
}

export async function putItemNotificationRead(item) {
  const client = new DynamoDBClient({ 
    region: awsRegion, 
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: identityPoolId
    })
    
  })

  const params = {
    TableName: "notification_msg_read",
    Item: item,
  };
  
  console.log(params)
  const command = new PutItemCommand(params);
  console.log(command)
  try {
    const results = await client.send(command);
    console.log(results);
  } catch (err) {
    console.error(err);
  }
}