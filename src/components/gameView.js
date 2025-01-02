import { View, Text, Dimensions, FlatList, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import requiredCards from "../img/requiredCards";
import requiredChips from "../img/requiredChips";

function cardCountString(cards) {
    const counts = [0];

    cards.forEach((card) => {
        if (!card.hidden) {
            const number = Number(card.rank);

            if (number) {
                counts[0] += number;

                if (counts[1]) {
                    counts[1] += number;
                };
            } else if (card.rank == "King" || card.rank == "Queen" || card.rank == "Jack") {
                counts[0] += 10;

                if (counts[1]) {
                    counts[1] += 10;
                };
            } else if (card.rank == "Ace") {
                if (counts[1]) {
                    if (counts[1] + 11 > 21) {
                        counts[1] += 1;
                    } else {
                        counts[1] += 11;
                    };
                } else {
                    counts.push(counts[0] + 11);
                };

                counts[0] += 1;
            };

            if (counts[1] && counts[1] > 21) {
                counts.splice(1, 1);
            };
        };
    });

    return counts.join("/");
};

function combineBets(bets) {
    let totalBet = 0;

    bets.forEach((stack) => {
        stack.forEach((bet) => {
            bet.forEach((amount) => {
                totalBet += amount;
            });
        });
    });

    return totalBet.toLocaleString("de-DE", { style: "decimal", maximumFractionDigits: 0, minimumFractionDigits: 0, useGrouping: true });
};

function CardImage(props) {
    let source = requiredCards["Back"];

    if (props.rank && props.suit) {
        if (!props.hidden) {
            source = requiredCards[`${props.rank}_${props.suit}`];
        };
    };

    return (
        <Image style={styles.cardImage} source={source} />
    );
};

function CardsDisplay(props) {
    const cardsArray = [];

    props.cards.forEach((card, index) => {
        cardsArray.push(<CardImage key={index} rank={card.rank} suit={card.suit} hidden={card.hidden} />);
    });

    return (
        <View>
            <View style={styles.textContainer}>
                <Text style={[styles.playerText, styles.countText]}>{cardCountString(props.cards)}</Text>
            </View>
            <View style={styles.cardDisplay}>
                {cardsArray}
            </View>
        </View>
    );
};

function ChipStack(props) {
    const chipsArray = [];

    props.stack.forEach((amount, index) => {
        chipsArray.push(<Image key={index} style={[styles.chipImage, {zIndex: index}]} source={requiredChips[`${amount}`]} />);
    });

    chipsArray.reverse();

    return (
        <View style={styles.chipStack}>
            {chipsArray}
        </View>
    );
};

function ChipsDisplay(props) {
    const stackArray = [];

    props.bets.forEach((deck, index) => {
        deck.forEach((stack, stackIndex) => {
            stackArray.push(stack);
        });
    });

    return (
        <FlatList
            style={styles.chipsDisplay}
            contentContainerStyle={listStyles.chipsContentContainer}
            columnWrapperStyle={listStyles.chipsColumnWrapper}
            inverted={true}
            numColumns={2}
            data={stackArray}
            renderItem={({ item, index }) => (
                <ChipStack key={index} stack={item} />
            )}
        />
    );
};

function DealerView(props) {
    return (
        <View style={styles.dealerView}>
            <View style={styles.textContainer}>
                <Text style={[styles.playerText, { minWidth: "75%" }]} numberOfLines={1}>Dealer</Text>
            </View>
            <CardsDisplay cards={props.cards} />
        </View>
    );
};

function CardsDispenser() {
    return (
        <View style={styles.dispenserView}>
            <CardImage />
            <CardImage />
            <CardImage />
            <CardImage />
            <CardImage />
        </View>
    );
};

function PlayerView(props) {
    return (
        <View style={styles.playerView}>
            <FlatList
                inverted={true}
                data={props.decks}
                renderItem={({ item, index }) => (
                    <CardsDisplay key={index} cards={item} />
                )}
            />
            <View style={styles.textContainer}>
                <Text style={[styles.playerText, styles.countText, { minWidth: "50%" }]}>${combineBets(props.bets)}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.playerText, { minWidth: "65%" }]} numberOfLines={1}>{props.username}</Text>
            </View>
            <ChipsDisplay bets={props.bets} />
        </View>
    );
}

export default function GameView(props) {
    const screenWidth = Dimensions.get("window").width;
    EStyleSheet.build({ $rem: screenWidth / 410 });

    return (
        <View style={styles.container}>
            <DealerView
                cards={props.dealerCards}
            />
            <CardsDispenser />
            <FlatList
                style={styles.playersContainer}
                contentContainerStyle={listStyles.playersContentContainer}
                inverted={true}
                numColumns={3}
                data={props.players.slice().reverse()}
                renderItem={({ item, index }) => (
                    <PlayerView key={index} username={item.username} bets={item.bets} decks={item.decks} />
                )}
            />
        </View>
    );
};

const listStyles = EStyleSheet.create({
    playersContentContainer: {
        flex: 1,
        alignItems: "center",
        gap: "10rem"
    },
    chipsContentContainer: {
        gap: "5rem"
    },
    chipsColumnWrapper: {
        gap: "5rem"
    },
});

const styles = EStyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        width: "100%",
        padding: 15
    },
    dealerView: {
        position: "absolute",
        justifyContent: "center",
        width: "115rem",
        top: "10rem"
    },
    dispenserView: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        columnGap: "-39rem",
        top: "100rem",
        right: "30rem"
    },
    playersContainer: {
        position: "absolute",
        bottom: "10rem",
    },
    playerView: {
        width: "115rem",
        overflow: "visible"
    },
    textContainer: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: "2.5rem",
        padding: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    playerText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: "10rem",
    },
    countText: {
        fontSize: "10rem"
    },
    cardDisplay: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: "-26.25rem",
        margin: "5rem",
        minHeight: "51rem"
    },
    cardImage: {
        width: "35rem",
        aspectRatio: 500 / 726
    },
    chipsDisplay: {
        position: "absolute",
        bottom: "10rem",
        left: "100rem"
    },
    chipStack: {
        rowGap: "-12.5rem",
    },
    chipImage: {
        height: "15rem",
        aspectRatio: 1 / 1
    }
});