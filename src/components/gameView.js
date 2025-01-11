import { View, Text, Dimensions, FlatList, Image } from 'react-native';
import { useImperativeHandle, forwardRef, useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import requiredCards from "../img/requiredCards";
import requiredChips from "../img/requiredChips";

const deckStateIconsDeckTemplate = {
    showBlackjack: false,
    showBust: false,
    showWin: false,
    showLose: false,
    showPush: false
};

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

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

function resetDeckStateIcons(setDeckStateIcons) {
    setDeckStateIcons({});
};

function updateDeckStateIcons(deckStateIcons, setDeckStateIcons, players) {
    const deckStateIconsClone = JSON.parse(JSON.stringify(deckStateIcons));

    if (!deckStateIconsClone.dealer) {
        deckStateIconsClone.dealer = deckStateIconsDeckTemplate;
    };
        
    for (const player of players) {
        for (i = 0; i < player.decks.length; i++) {
            if (!deckStateIconsClone[`${player.id}_${i}`]) {
                deckStateIconsClone[`${player.id}_${i}`] = deckStateIconsDeckTemplate;
            };
        };
    };

    setDeckStateIcons(deckStateIconsClone);
};

async function playAnimation(deckStateIcons, setDeckStateIcons, data) {
    const animation = data.animation;
    const deckStateIconsClone = JSON.parse(JSON.stringify(deckStateIcons));

    switch (animation) {
        case "blackjack":
            if (data.player == "dealer") {
                deckStateIconsClone["dealer"].showBlackjack = true;
                setDeckStateIcons(deckStateIconsClone);
                await sleep(data.animationDuration);
                deckStateIconsClone["dealer"].showBlackjack = false;
                setDeckStateIcons(deckStateIconsClone);
            } else {
                deckStateIconsClone[`${data.player}_${data.deckIndex}`].showBlackjack = true;
                setDeckStateIcons(deckStateIconsClone);
                await sleep(data.animationDuration);
                deckStateIconsClone[`${data.player}_${data.deckIndex}`].showBlackjack = false;
                setDeckStateIcons(deckStateIconsClone);
            };

            break;
        case "bust":
            if (data.player == "dealer") {
                deckStateIconsClone["dealer"].showBust = true;
                setDeckStateIcons(deckStateIconsClone);
                await sleep(data.animationDuration);
                deckStateIconsClone["dealer"].showBust = false;
                setDeckStateIcons(deckStateIconsClone);
            } else {
                deckStateIconsClone[`${data.player}_${data.deckIndex}`].showBust = true;
                setDeckStateIcons(deckStateIconsClone);
                await sleep(data.animationDuration);
                deckStateIconsClone[`${data.player}_${data.deckIndex}`].showBust = false;
                setDeckStateIcons(deckStateIconsClone);
            };

            break;
        case "win":
            deckStateIconsClone[`${data.player}_${data.deckIndex}`].showWin = true;
            setDeckStateIcons(deckStateIconsClone);
            await sleep(data.animationDuration);
            deckStateIconsClone[`${data.player}_${data.deckIndex}`].showWin = false;
            setDeckStateIcons(deckStateIconsClone);

            break;
        case "lose":
            deckStateIconsClone[`${data.player}_${data.deckIndex}`].showLose = true;
            setDeckStateIcons(deckStateIconsClone);
            await sleep(data.animationDuration);
            deckStateIconsClone[`${data.player}_${data.deckIndex}`].showLose = false;
            setDeckStateIcons(deckStateIconsClone);

            break;
        case "push":
            deckStateIconsClone[`${data.player}_${data.deckIndex}`].showPush = true;
            setDeckStateIcons(deckStateIconsClone);
            await sleep(data.animationDuration);
            deckStateIconsClone[`${data.player}_${data.deckIndex}`].showPush = false;
            setDeckStateIcons(deckStateIconsClone);

            break;
        default:
            break;
    };
};

function BlackjackIcon() {
    return (
        <View style={styles.deckStatusView}>
            <Image style={styles.deckStatusImage} source={require("../img/deck_status/Blackjack.png")} />
        </View>
    );
};

function BustIcon() {
    return (
        <View style={styles.deckStatusView}>
            <Image style={styles.deckStatusImage} source={require("../img/deck_status/Bust.png")} />
        </View>
    );
};

function WinIcon() {
    return (
        <View style={styles.deckStatusView}>
            <Image style={styles.deckStatusImage} source={require("../img/deck_status/Win.png")} />
        </View>
    );
};

function LoseIcon() {
    return (
        <View style={styles.deckStatusView}>
            <Image style={styles.deckStatusImage} source={require("../img/deck_status/Lose.png")} />
        </View>
    );
};

function PushIcon() {
    return (
        <View style={styles.deckStatusView}>
            <Image style={styles.deckStatusImage} source={require("../img/deck_status/Push.png")} />
        </View>
    );
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
                {props.showBlackjack ? <BlackjackIcon /> : []}
                {props.showBust ? <BustIcon /> : []}
                {props.showWin ? <WinIcon /> : []}
                {props.showLose ? <LoseIcon /> : []}
                {props.showPush ? <PushIcon /> : []}
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
            {
                props.deckStateIcons["dealer"]
                ? <CardsDisplay cards={props.cards} showBlackjack={props.deckStateIcons["dealer"].showBlackjack} showBust={props.deckStateIcons["dealer"].showBust} />
                : <CardsDisplay cards={props.cards} />
            }
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
                    props.deckStateIcons[`${props.id}_${index}`] 
                    ? <CardsDisplay key={index} cards={item} showBlackjack={props.deckStateIcons[`${props.id}_${index}`]["showBlackjack"]} showBust={props.deckStateIcons[`${props.id}_${index}`]["showBust"]} showWin={props.deckStateIcons[`${props.id}_${index}`]["showWin"]} showLose={props.deckStateIcons[`${props.id}_${index}`]["showLose"]} showPush={props.deckStateIcons[`${props.id}_${index}`].showPush} />
                    : <CardsDisplay key={index} cards={item} />
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
};

function GameView(props, ref) {
    const screenWidth = Dimensions.get("window").width;
    EStyleSheet.build({ $rem: screenWidth / 410 });

    const [deckStateIcons, setDeckStateIcons] = useState({});

    useImperativeHandle(ref, () => ({
        playAnimation: function(data) {
            playAnimation(deckStateIcons, setDeckStateIcons, data);
        },
        updateDeckStateIcons: function() {
            updateDeckStateIcons(deckStateIcons, setDeckStateIcons, props.players);
        },
        resetDeckStateIcons: function() {
            resetDeckStateIcons(setDeckStateIcons);
        }
    }));

    return (
        <View style={styles.container} id="gameView">
            <DealerView
                cards={props.dealerCards}
                deckStateIcons={deckStateIcons}
            />
            <CardsDispenser />
            <FlatList
                style={styles.playersContainer}
                contentContainerStyle={listStyles.playersContentContainer}
                inverted={true}
                numColumns={3}
                data={props.players.slice().reverse()}
                renderItem={({ item, index }) => (
                    <PlayerView key={index} id={item.id} username={item.username} bets={item.bets} decks={item.decks} deckStateIcons={deckStateIcons} />
                )}
            />
        </View>
    );
};

export default forwardRef(GameView);

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
        justifyContent: "flex-end",
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
    },
    deckStatusView: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        aspectRatio: 1 / 1,
        zIndex: 100
    },
    deckStatusImage: {
        width: "100%",
        height: "100%"
    }
});