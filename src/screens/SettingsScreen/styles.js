import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FDF6F0', // Same soft background color as before
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333333', // Neutral, soft text color
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#606c38', // Calm green color for labels
        marginVertical: 10,
        alignSelf: 'stretch',
    },
    input: {
        height: 48,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 16,
        borderWidth: 1,
        borderColor: '#cccccc',
        width: '100%',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#FF7F50', // Same bright, friendly button color
        marginTop: 20,
        marginBottom: 20,
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
