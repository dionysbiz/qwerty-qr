import React from 'react';
import { Button, Icon, IconElement, List, ListItem, Layout, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


interface IListItem {
  title: string;
  description: string;
}

const data = new Array(16).fill({
  title: 'Title for Item',
  description: 'Description for Item',
});

export const OfflineQRMenuListLayout = (): JSX.Element => {

  const renderItemAccessory = (): React.ReactElement => (
    <Button size='tiny'>
QR Code
    </Button>
  );

  const renderItemIcon = (props): IconElement => (
    <Icon
      {...props}
      name='person'
    />
  );

  const renderAddItemIcon = (): IconElement => (
    <MaterialIcons name="playlist-add" size={25} color="white" />
  );

  const renderItem = ({ item, index }: { item: IListItem; index: number }): JSX.Element => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  );

  return (
    <Layout>
      <Layout
        style={styles.rowContainer}
        level='1'
      >
        <Text category='h5' >
          QR Menu Item
        </Text>
        <Button
          style={styles.addItemButton}
          appearance='ghost'
          status='danger'
          accessoryLeft={renderAddItemIcon}
        />
      </Layout>
      
      <List
        style={styles.container}
        data={data}
        renderItem={renderItem}
      />
    </Layout>
    
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addItemButton: {
    margin: 2,
  },
});