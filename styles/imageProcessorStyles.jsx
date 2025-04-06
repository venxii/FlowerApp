import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edefe5', // Light off-white background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    flexDirection: 'column',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#41682c', // Deep green for title
    marginBottom: 24,
    fontFamily: 'Roboto',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    padding: 8,
  },
  backButtonText: {
    color: '#41682c',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    gap: 10,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#41682c', // Primary deep green button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    height: 170,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#edefe5', // Light text on primary button

    fontWeight: '500',
    textAlign: "center",
    fontFamily: 'Roboto',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  image: {
    width: 288,
    height: 288,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#41682c',
  },
  processButton: {
    backgroundColor: '#41682c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(65, 104, 44, 0.8)', // Semi-transparent deep green overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#edefe5',
    marginTop: 8,
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  interruptButton: {
    marginTop: 16,
    backgroundColor: '#d9e7cb', // Secondary color for interrupt actions
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  interruptButtonText: {
    color: '#41682c',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
});
