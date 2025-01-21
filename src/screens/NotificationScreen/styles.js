import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Support scrollable content
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FDF6F0',
    alignItems: 'center',
    marginTop:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF7F50', // Bright coral color
    textAlign: 'center',
  },
  notificationItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: '#FFF4E5', // Soft background for unread notifications
    borderLeftWidth: 5,
    borderLeftColor: '#FF7F50', // Accent for unread
  },
  readNotification: {
    backgroundColor: '#F3F4F6', // Muted background for read notifications
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  notificationTimestamp: {
    fontSize: 14,
    color: '#606c38', // Calm green for the timestamp
    marginTop: 8,
  },
  unreadLabel: {
    fontSize: 12,
    color: '#FF7F50',
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default styles;
