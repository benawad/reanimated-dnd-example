import React from "react";
import { StyleSheet, View, Dimensions, Text, SafeAreaView } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
const { width } = Dimensions.get("window");

const { cond, eq, add, call, set, Value, event, or } = Animated;

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.dragX = new Value(0);
    this.dragY = new Value(0);
    this.absoluteY = new Value(100);
    this.offsetX = new Value(width / 2);
    this.offsetY = new Value(100);
    this.gestureState = new Value(-1);
    this.onGestureEvent = event([
      {
        nativeEvent: {
          // translationX: this.dragX,
          // translationY: this.dragY,
          state: this.gestureState,
          absoluteY: this.absoluteY
        }
      }
    ]);

    // this.addY = add(this.offsetY, this.dragY);
    // this.addX = add(this.offsetX, this.dragX);
    this.circleY = add(this.absoluteY, new Value(200));

    // this.transX = cond(
    //   eq(this.gestureState, State.ACTIVE),
    //   this.addX,
    //   set(this.offsetX, this.addX)
    // );

    // this.transY = cond(eq(this.gestureState, State.ACTIVE), this.addY, [
    //   set(this.offsetY, this.addY)
    // ]);

    this.state = { dragging: false, y: 0 };
  }

  start = ([]) => {
    this.setState({ dragging: true });
  };

  moving = ([y, circleY]) => {
    this.setState({ y });
  };

  done = ([]) => {
    this.setState({ dragging: false });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>y: {this.state.y}</Text>
        <Animated.Code>
          {() => cond(eq(this.gestureState, State.BEGAN), call([], this.start))}
        </Animated.Code>
        <Animated.Code>
          {() =>
            cond(
              eq(this.gestureState, State.ACTIVE),
              call([this.absoluteY, this.circleY], this.moving)
            )
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            cond(
              or(
                eq(this.gestureState, State.END),
                eq(this.gestureState, State.FAILED),
                eq(this.gestureState, State.CANCELLED)
              ),
              call([], this.done)
            )
          }
        </Animated.Code>
        {this.state.dragging && (
          <Animated.View style={[styles.box, { top: this.circleY }]} />
        )}
        <PanGestureHandler
          maxPointers={1}
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}
        >
          <Animated.View
            style={[
              // styles.box,
              {
                top: this.absoluteY
              }
            ]}
          >
            <Text>hello</Text>
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>
    );
  }
}

const CIRCLE_SIZE = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  box: {
    backgroundColor: "tomato",
    position: "absolute",
    marginLeft: -(CIRCLE_SIZE / 2),
    marginTop: -(CIRCLE_SIZE / 2),
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderColor: "#000"
  }
});
