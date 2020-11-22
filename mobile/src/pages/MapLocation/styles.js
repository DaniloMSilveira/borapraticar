import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  map: {
    flex: 1
  },

  avatar: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#3b9eff'
  },

  callout: {
    height: 180,
    alignItems: 'center',
    marginTop: 20
  },

  gpName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 20
  },

  gpActivity: {
    fontSize: 14,
    marginTop: 5
  },

  gpEndereco: {
    fontSize: 14,
    marginBottom: 5
  },

  gpHour: {
    fontSize: 12,
  },

  gpTextButton: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff'
  },

  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#3b9eff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },

  gpButton: {
    width: 120,
    height: 30,
    backgroundColor: '#3b9eff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
})
